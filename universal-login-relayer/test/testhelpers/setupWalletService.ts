import {EventEmitter} from 'fbemitter';
import sinon from 'sinon';
import {Wallet, Contract, utils} from 'ethers';
import {KeyPair, calculateInitializeSignature, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {encodeDataForSetup, computeGnosisCounterfactualAddress, deployGnosisSafe, deployProxyFactory} from '@universal-login/contracts';
import ENSRegistrar from '@universal-login/contracts/dist/contracts/ENSRegistrar.json';
import {WalletDeploymentService} from '../../src/integration/ethereum/WalletDeploymentService';
import {buildEnsService} from './buildEnsService';
import {WalletDeployer} from '../../src/integration/ethereum/WalletDeployer';
import ENSService from '../../src/integration/ethereum/ensService';
import {AddressZero} from 'ethers/constants';
import {deployContract} from 'ethereum-waffle';
import {DEPLOY_GAS_LIMIT} from '@universal-login/commons';

export default async function setupWalletService(wallet: Wallet) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const walletContractAddress = (await deployGnosisSafe(wallet)).address;
  const factoryContract = await deployProxyFactory(wallet);
  const hooks = new EventEmitter();
  const ensRegistrar = (await deployContract(wallet, ENSRegistrar)).address;
  const config = {walletContractAddress, factoryAddress: factoryContract.address, supportedTokens: [], ensRegistrar};
  const walletDeployer = new WalletDeployer(factoryContract.address, wallet);
  const fakeBalanceChecker = {
    findTokenWithRequiredBalance: () => true,
  };
  const fakeDevicesService = {
    addOrUpdate: sinon.spy(),
  };
  const walletService = new WalletDeploymentService(config as any, ensService, hooks, walletDeployer, fakeBalanceChecker as any, fakeDevicesService as any);
  const callback = sinon.spy();
  hooks.addListener('created', callback);
  return {provider, wallet, walletService, callback, factoryContract, ensService, fakeDevicesService, ensRegistrar, walletContractAddress};
}

export const getSetupData = async (keyPair: KeyPair, ensName: string, ensService: ENSService, gasPrice: string, relayerAddress: string, ensRegistrarAddress: string, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const args = await ensService.argsFor(ensName);
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: 1,
    deploymentCallAddress: ensRegistrarAddress,
    deploymentCallData: new utils.Interface(ENSRegistrar.interface as any).functions.register.encode(args),
    fallbackHandler: AddressZero,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: relayerAddress,
  };
  return encodeDataForSetup(deployment);
};

export const createFutureWallet = async (keyPair: KeyPair, ensName: string, factoryContract: Contract, wallet: Wallet, ensService: ENSService, ensRegistrarAddress: string, gnosisSafeAddress: string, gasPrice = '1') => {
  const setupData = await getSetupData(keyPair, ensName, ensService, gasPrice, wallet.address, ensRegistrarAddress, ETHER_NATIVE_TOKEN.address);
  const futureContractAddress = computeGnosisCounterfactualAddress(factoryContract.address, 0, setupData, gnosisSafeAddress);
  await wallet.sendTransaction({to: futureContractAddress, value: utils.parseEther('1')});
  const signature = await calculateInitializeSignature(setupData, keyPair.privateKey);
  return {signature, futureContractAddress};
};

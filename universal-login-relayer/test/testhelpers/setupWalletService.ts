import sinon from 'sinon';
import {Wallet, Contract, utils} from 'ethers';
import {KeyPair, calculateInitializeSignature, ETHER_NATIVE_TOKEN, createKeyPair} from '@unilogin/commons';
import {encodeDataForSetup, computeGnosisCounterfactualAddress, deployGnosisSafe, deployProxyFactory, gnosisSafe, INITIAL_REQUIRED_CONFIRMATIONS, deployDefaultCallbackHandler} from '@unilogin/contracts';
import {WalletDeploymentService} from '../../src/integration/ethereum/WalletDeploymentService';
import {buildEnsService} from './buildEnsService';
import {WalletDeployer} from '../../src/integration/ethereum/WalletDeployer';
import ENSService from '../../src/integration/ethereum/ensService';
import {deployContract} from 'ethereum-waffle';
import {DEPLOY_GAS_LIMIT} from '@unilogin/commons';
import {DEPLOY_CONTRACT_NONCE} from '@unilogin/contracts';

export default async function setupWalletService(wallet: Wallet) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const walletContractAddress = (await deployGnosisSafe(wallet)).address;
  const factoryContract = await deployProxyFactory(wallet);
  const fallbackHandler = await deployDefaultCallbackHandler(wallet);
  const ensRegistrar = (await deployContract(wallet, gnosisSafe.ENSRegistrar)).address;
  const config = {walletContractAddress, factoryAddress: factoryContract.address, supportedTokens: [], ensRegistrar, fallbackHandlerAddress: fallbackHandler.address};
  const walletDeployer = new WalletDeployer(factoryContract.address, wallet);
  const fakeBalanceChecker = {
    findTokenWithRequiredBalance: () => true,
  };
  const fakeDevicesService = {
    addOrUpdate: sinon.spy(),
  };
  const walletService = new WalletDeploymentService(config as any, ensService, walletDeployer, fakeBalanceChecker as any, fakeDevicesService as any);
  return {provider, wallet, walletService, factoryContract, ensService, fakeDevicesService, ensRegistrar, walletContractAddress, fallbackHandler};
}

export const getSetupData = async (keyPair: KeyPair, ensName: string, ensService: ENSService, gasPrice: string, relayerAddress: string, ensRegistrarAddress: string, fallbackHandlerAddress: string, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const args = await ensService.argsFor(ensName);
  const deployment = {
    owners: [keyPair.publicKey],
    requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
    deploymentCallAddress: ensRegistrarAddress,
    deploymentCallData: new utils.Interface(gnosisSafe.ENSRegistrar.interface as any).functions.register.encode(args),
    fallbackHandler: fallbackHandlerAddress,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: relayerAddress,
  };
  return encodeDataForSetup(deployment);
};

export const createFutureWallet = async (keyPair: KeyPair, ensName: string, factoryContract: Contract, wallet: Wallet, ensService: ENSService, ensRegistrarAddress: string, gnosisSafeAddress: string, fallbackHandler: string, gasPrice = '1') => {
  const setupData = await getSetupData(keyPair, ensName, ensService, gasPrice, wallet.address, ensRegistrarAddress, fallbackHandler, ETHER_NATIVE_TOKEN.address);
  const futureContractAddress = computeGnosisCounterfactualAddress(factoryContract.address, DEPLOY_CONTRACT_NONCE, setupData, gnosisSafeAddress);
  await wallet.sendTransaction({to: futureContractAddress, value: utils.parseEther('1')});
  const signature = await calculateInitializeSignature(setupData, keyPair.privateKey);
  return {signature, futureContractAddress};
};

// export const createTestFutureWallet = async (wallet: Wallet) => {
//   const keyPair = createKeyPair();
//   const ensName = 'login.unilogin.eth';
//   const factoryContract = undefined;
//   const ensService = undefined;
//   const ensRegistrarAddress = '';
//   const gnosisSafeAddress = '';
//   const fallbackHandler = '';
//   return createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrarAddress, gnosisSafeAddress, fallbackHandler);
// }

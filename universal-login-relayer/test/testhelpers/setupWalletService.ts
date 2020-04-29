import sinon from 'sinon';
import {Wallet, Contract, utils} from 'ethers';
import {KeyPair, calculateInitializeSignature, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
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
  const gnosisSafeMaster = await deployGnosisSafe(wallet);
  const factoryContract = await deployProxyFactory(wallet);
  const fallbackHandler = await deployDefaultCallbackHandler(wallet);
  const ensRegistrar = await deployContract(wallet, gnosisSafe.ENSRegistrar);
  const config = {walletContractAddress: gnosisSafeMaster.address, factoryAddress: factoryContract.address, supportedTokens: [], ensRegistrar: ensRegistrar.address, fallbackHandlerAddress: fallbackHandler.address};
  const walletDeployer = new WalletDeployer(factoryContract.address, wallet);
  const fakeBalanceChecker: any = {
    findTokenWithRequiredBalance: () => true,
  };
  const fakeDevicesService: any = {
    addOrUpdate: sinon.spy(),
  };
  const fakeGasPriceOracle: any = {
    getGasPrices: () => ({fast: {gasPrice: utils.bigNumberify('9090')}}),
  };
  const walletService = new WalletDeploymentService(config as any, ensService, walletDeployer, fakeBalanceChecker, fakeDevicesService, fakeGasPriceOracle);
  return {provider, wallet, walletService, factoryContract, ensService, fakeDevicesService, ensRegistrar, gnosisSafeMaster, fallbackHandler};
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
  const signature = await calculateInitializeSignature(setupData, keyPair.privateKey);
  await wallet.sendTransaction({to: futureContractAddress, value: utils.parseEther('1')});
  return {signature, futureContractAddress};
};

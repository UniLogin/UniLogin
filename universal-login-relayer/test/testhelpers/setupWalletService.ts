import sinon from 'sinon';
import {Wallet, Contract, utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {getMockedGasPriceOracle} from '@unilogin/commons/testutils';
import {KeyPair, calculateInitializeSignature, DEPLOY_GAS_LIMIT, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import {encodeDataForSetup, computeGnosisCounterfactualAddress, deployGnosisSafe, deployProxyFactory, gnosisSafe, INITIAL_REQUIRED_CONFIRMATIONS, deployDefaultCallbackHandler} from '@unilogin/contracts';
import {WalletDeploymentService} from '../../src/integration/ethereum/WalletDeploymentService';
import {buildEnsService} from './buildEnsService';
import {WalletDeployer} from '../../src/integration/ethereum/WalletDeployer';
import ENSService from '../../src/integration/ethereum/ensService';
import {DEPLOY_CONTRACT_NONCE} from '@unilogin/contracts';
import {getSetupData} from './http';
import {TransactionGasPriceComputator} from '../../src/integration/ethereum/TransactionGasPriceComputator';

export default async function setupWalletService(wallet: Wallet) {
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const gnosisSafeMaster = await deployGnosisSafe(wallet);
  const factoryContract = await deployProxyFactory(wallet);
  const fallbackHandler = await deployDefaultCallbackHandler(wallet);
  const ensRegistrar = await deployContract(wallet, gnosisSafe.ENSRegistrar);
  const config = {walletContractAddress: gnosisSafeMaster.address, factoryAddress: factoryContract.address, supportedTokens: [], ensRegistrar: ensRegistrar.address, fallbackHandlerAddress: fallbackHandler.address};
  const walletDeployer = new WalletDeployer(factoryContract.address, wallet);
  const fakeBalanceValidator: any = {
    validate: () => Promise.resolve(),
  };
  const fakeDevicesService: any = {
    addOrUpdate: sinon.spy(),
  };
  const fakeFutureWalletStore: any = {
    get: () => ({tokenPriceInETH: '1'}),
  };
  const transactionGasPriceComputator = new TransactionGasPriceComputator(getMockedGasPriceOracle());
  const walletService = new WalletDeploymentService(config as any, ensService, walletDeployer, fakeBalanceValidator, fakeDevicesService, transactionGasPriceComputator, fakeFutureWalletStore);
  return {provider, wallet, walletService, factoryContract, ensService, fakeDevicesService, ensRegistrar, gnosisSafeMaster, fallbackHandler};
}

export const getSetupDataUsingEnsService = async (keyPair: KeyPair, ensName: string, ensService: ENSService, gasPrice: string, relayerAddress: string, ensRegistrarAddress: string, fallbackHandlerAddress: string, gasToken = ETHER_NATIVE_TOKEN.address) => {
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

export const createFutureWalletUsingEnsService = async (keyPair: KeyPair, ensName: string, factoryContract: Contract, wallet: Wallet, ensService: ENSService, ensRegistrarAddress: string, gnosisSafeAddress: string, fallbackHandler: string, gasPrice = TEST_GAS_PRICE) => {
  const setupData = await getSetupDataUsingEnsService(keyPair, ensName, ensService, gasPrice, wallet.address, ensRegistrarAddress, fallbackHandler, ETHER_NATIVE_TOKEN.address);
  const contractAddress = computeGnosisCounterfactualAddress(factoryContract.address, DEPLOY_CONTRACT_NONCE, setupData, gnosisSafeAddress);
  const signature = calculateInitializeSignature(setupData, keyPair.privateKey);
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1')});
  return {signature, contractAddress};
};

export const createFutureWallet = async (keyPair: KeyPair, ensName: string, factoryContract: Contract, relayerWallet: Wallet, ensAddress: string, ensRegistrarAddress: string, gnosisSafeAddress: string, fallbackHandlerAddress: string, gasPrice = TEST_GAS_PRICE, gasToken?: string) => {
  const setupData = await getSetupData(keyPair, ensName, ensAddress, relayerWallet.provider, gasPrice, relayerWallet.address, ensRegistrarAddress, fallbackHandlerAddress, gasToken);
  const contractAddress = computeGnosisCounterfactualAddress(factoryContract.address, DEPLOY_CONTRACT_NONCE, setupData, gnosisSafeAddress);
  const signature = calculateInitializeSignature(setupData, keyPair.privateKey);
  return {signature, contractAddress};
};

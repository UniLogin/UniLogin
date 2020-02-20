import {Contract, providers, utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {createKeyPair, ETHER_NATIVE_TOKEN, withENS} from '@unilogin/commons';
import {deployENS} from '@unilogin/commons/testutils';
import {createFutureDeploymentWithENS} from '../helpers/FutureDeployment';
import {deployFactory, deployWalletContract} from '../../src';
import MockToken from '../../dist/contracts/MockToken.json';
import {WalletContractInterface} from '../helpers/interfaces';

export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const {factoryContract, walletContract} = await setupMasterWithRefundAndFactory(deployer);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  return {
    ensDomainData: {
      ensAddress,
      registrarAddress,
      resolverAddress,
    },
    walletContract,
    provider: providerWithENS,
    deployer,
    factoryContract,
  };
}

export async function setupMasterWithRefundAndFactory(deployer: Wallet) {
  const walletContract = await deployWalletContract(deployer);
  const factoryContract = await deployFactory(deployer, walletContract.address);
  return {
    walletContract,
    factoryContract,
  };
}

export async function setupWalletContract(deployer: Wallet) {
  const {ensDomainData, walletContract, provider, factoryContract} = await setupEnsAndMaster(deployer);
  const keyPair = createKeyPair();
  const {initializeData, futureAddress, signature} = createFutureDeploymentWithENS({keyPair, walletContractAddress: walletContract.address, gasPrice: '1000000', ensDomainData, factoryContract, gasToken: ETHER_NATIVE_TOKEN.address});
  await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('10.0')});
  await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
  const proxyWallet = new Contract(futureAddress, WalletContractInterface, provider);
  return {
    proxyWallet,
    keyPair,
    deployer,
    provider,
  };
}

export async function walletContractWithTokenAndEther(deployer: Wallet) {
  const {provider, proxyWallet, keyPair} = await setupWalletContract(deployer);
  const mockToken = await deployContract(deployer, MockToken);
  await mockToken.transfer(proxyWallet.address, utils.parseEther('1.0'));
  await deployer.sendTransaction({to: proxyWallet.address, value: utils.parseEther('1.0')});
  return {
    provider,
    proxyWallet,
    keyPair,
    deployer,
    mockToken,
  };
}

export function walletContractFixture(givenProvider: providers.Provider, [wallet]: Wallet[]) {
  return setupWalletContract(wallet);
}

export function ensAndMasterFixture(givenProvider: providers.Provider, [deployer]: Wallet[]) {
  return setupEnsAndMaster(deployer);
}

export function walletContractWithFundsFixture(givenProvider: providers.Provider, [wallet]: Wallet[]) {
  return walletContractWithTokenAndEther(wallet);
}

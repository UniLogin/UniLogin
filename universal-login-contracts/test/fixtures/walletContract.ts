import {providers, Wallet, utils, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '../../build/WalletMaster.json';
import ProxyContract from '../../build/Proxy.json';
import {withENS, createKeyPair, computeContractAddress} from '@universal-login/commons';
import {deployENS} from '@universal-login/commons/testutils';
import {encodeInitializeWithENSData, encodeInitializeData, deployFactory, getDeployData} from '../../lib';
import MockToken from '../../build/MockToken.json';

export type EnsDomainData = {
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
};

type SetupInitializeArgs = {
  key: string;
  ensDomainData: EnsDomainData;
  name?: string;
  domain?: string;
};

export function setupInitializeArgs({key, ensDomainData, name = 'name', domain = 'mylogin.eth'}: SetupInitializeArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [key, hashLabel, ensName, node, ensDomainData.ensAddress, ensDomainData.registrarAddress, ensDomainData.resolverAddress];
  return args;
}

export function createProxyDeployWithENSArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeArgs({key: publicKey, ensDomainData, name});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export async function setupEnsAndMaster(deployer: Wallet) {
  const {ensAddress, resolverAddress, registrarAddress} = await deployENS(deployer);
  const walletMaster = await deployContract(deployer, WalletMaster);
  const providerWithENS = withENS(deployer.provider as providers.Web3Provider, ensAddress);
  const factoryContract = await deployFactory(deployer, walletMaster.address);
  return {
    ensDomainData: {
      ensAddress,
      registrarAddress,
      resolverAddress
    },
    walletMaster,
    provider: providerWithENS,
    deployer,
    factoryContract
  };
}

export function setupInitializeWithEnsAndFutureAddress(publicKey: string, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract) {
  const [, initializeWithENS] = createProxyDeployWithENSArgs(publicKey, ensDomainData, walletMasterAddress);
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const computedContractAddress = computeContractAddress(factoryContract.address, publicKey, initData);
  return {
    initializeWithENS,
    initData,
    futureAddress: computedContractAddress
  }
}

export function setupInitializeAndFutureAddress(publicKey: string, walletMasterAddress: string, factoryContract: Contract) {
  const initializeData = encodeInitializeData(publicKey);
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const computedContractAddress = computeContractAddress(factoryContract.address, publicKey, initData);
  return {
    initializeData,
    initData,
    futureAddress: computedContractAddress
  }
}

export async function setupWalletContract(deployer: Wallet) {
  const {ensDomainData, walletMaster, provider, factoryContract} = await setupEnsAndMaster(deployer);
  const keyPair = createKeyPair();
  const {initializeWithENS, futureAddress} = setupInitializeWithEnsAndFutureAddress(keyPair.publicKey, walletMaster.address, ensDomainData, factoryContract);
  await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('10.0')});
  await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
  const walletContract = new Contract(futureAddress, WalletMaster.interface, provider);
  return {
    walletContract,
    keyPair,
    deployer,
    provider
  };
}

export async function walletContractWithTokenAndEther(deployer: Wallet) {
  const {provider, walletContract, keyPair} = await setupWalletContract(deployer);
  const mockToken = await deployContract(deployer, MockToken);
  await mockToken.transfer(walletContract.address, utils.parseEther('1.0'));
  await deployer.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
  return {
    provider,
    walletContract,
    keyPair,
    deployer,
    mockToken
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

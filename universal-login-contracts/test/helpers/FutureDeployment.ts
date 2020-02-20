import {Contract} from 'ethers';
import {computeCounterfactualAddress, KeyPair, calculateInitializeSignature, ETHER_NATIVE_TOKEN, getDeployData} from '@unilogin/commons';
import ProxyContract from '../../dist/contracts/WalletProxy.json';
import {encodeInitializeData} from '../../src';
import {createProxyDeployWithENSArgs} from './ProxyUtils';

export type EnsDomainData = {
  ensAddress: string;
  registrarAddress: string;
  resolverAddress: string;
};

type FutureDeployment = {
  initializeData: string;
  futureAddress: string;
  signature: string;
};

export type CreateFutureDeploymentWithENS = {
  keyPair: KeyPair;
  walletContractAddress: string;
  ensDomainData: EnsDomainData;
  factoryContract: Contract;
  gasPrice: string;
  gasToken: string;
};

export function createFutureDeploymentWithENS({keyPair, walletContractAddress, ensDomainData, factoryContract, gasPrice, gasToken}: CreateFutureDeploymentWithENS): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(keyPair, ensDomainData, walletContractAddress, gasPrice, gasToken);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletContractAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature,
  };
}

export function createFutureDeployment(keyPair: KeyPair, walletContractAddress: string, factoryContract: Contract, gasPrice = '1', gasToken = ETHER_NATIVE_TOKEN.address): FutureDeployment {
  const initializeData = encodeInitializeData([keyPair.publicKey, gasPrice, gasToken]);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletContractAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature,
  };
}

export function getFutureAddress(walletContractAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletContractAddress]);
  return computeCounterfactualAddress(factoryContractAddress, publicKey, initData);
}

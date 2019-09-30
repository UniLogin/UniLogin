import {Contract} from 'ethers';
import {computeCounterfactualAddress, KeyPair, calculateInitializeSignature} from '@universal-login/commons';
import ProxyContract from '../build/WalletProxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData} from '.';

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

export function createFutureDeploymentWithENS({keyPair, walletContractAddress, ensDomainData, factoryContract, gasPrice, gasToken} : CreateFutureDeploymentWithENS): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(keyPair, ensDomainData, walletContractAddress, gasPrice, gasToken);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletContractAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export function createFutureDeployment(keyPair: KeyPair, walletContractAddress: string, factoryContract: Contract): FutureDeployment {
  const initializeData = encodeInitializeData(keyPair.publicKey);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletContractAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export function getFutureAddress(walletContractAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletContractAddress]);
  return computeCounterfactualAddress(factoryContractAddress, publicKey, initData);
}

import {Contract} from 'ethers';
import {computeContractAddress, KeyPair, calculateInitializeSignature} from '@universal-login/commons';
import ProxyContract from '../build/Proxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData} from '.';

type FutureDeployment = {
  initializeData: string;
  futureAddress: string;
  signature: string;
};

export type CreateFutureDeploymentWithRefundArgs = {
  keyPair: KeyPair;
  walletMasterAddress: string;
  ensDomainData: EnsDomainData;
  factoryContract: Contract;
  gasPrice: string;
};

export type CreateFutureDeploymentWithENS = {
  keyPair: KeyPair;
  walletMasterAddress: string;
  ensDomainData: EnsDomainData;
  factoryContract: Contract;
  gasPrice: string;
}

export function createFutureDeploymentWithENS({keyPair, walletMasterAddress, ensDomainData, factoryContract, gasPrice} : CreateFutureDeploymentWithENS): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(keyPair, ensDomainData, walletMasterAddress, gasPrice);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export function createFutureDeployment(keyPair: KeyPair, walletMasterAddress: string, factoryContract: Contract): FutureDeployment {
  const initializeData = encodeInitializeData(keyPair.publicKey);
  const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

// export function createFutureDeploymentWithRefund({keyPair, walletMasterAddress, ensDomainData, factoryContract, gasPrice}: CreateFutureDeploymentWithRefundArgs): FutureDeployment {
//   const [, initializeData] = createProxyDeployWithRefundArgs(keyPair, ensDomainData, walletMasterAddress, gasPrice);
//   const signature = calculateInitializeSignature(initializeData, keyPair.privateKey);
//   const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
//   return {
//     initializeData,
//     futureAddress,
//     signature
//   };
// }

export function getFutureAddress(walletMasterAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  return computeContractAddress(factoryContractAddress, publicKey, initData);
}

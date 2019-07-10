import {Contract} from 'ethers';
import {computeContractAddress, KeyPair, calculateInitializeSignature} from '@universal-login/commons';
import ProxyContract from '../build/Proxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData, createProxyDeployWithRefundArgs} from '.';

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

export async function createFutureDeploymentWithENS(keyPair: KeyPair, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract): Promise<FutureDeployment> {
  const [, initializeData] = createProxyDeployWithENSArgs(keyPair, ensDomainData, walletMasterAddress);
  const signature = await calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export async function createFutureDeployment(keyPair: KeyPair, walletMasterAddress: string, factoryContract: Contract): Promise<FutureDeployment> {
  const initializeData = encodeInitializeData(keyPair.publicKey);
  const signature = await calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export async function createFutureDeploymentWithRefund({keyPair, walletMasterAddress, ensDomainData, factoryContract, gasPrice}: CreateFutureDeploymentWithRefundArgs): Promise<FutureDeployment> {
  const [, initializeData] = await createProxyDeployWithRefundArgs(keyPair, ensDomainData, walletMasterAddress, gasPrice);
  const signature = await calculateInitializeSignature(initializeData, keyPair.privateKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress,
    signature
  };
}

export function getFutureAddress(walletMasterAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  return computeContractAddress(factoryContractAddress, publicKey, initData);
}

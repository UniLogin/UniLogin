import {Contract} from 'ethers';
import {computeContractAddress, KeyPair} from '@universal-login/commons';
import ProxyContract from '../build/Proxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData, createProxyDeployWithRefundArgs} from '.';

type FutureDeployment = {
  initializeData: string;
  futureAddress: string;
};

export type CreateFutureDeploymentWithRefundArgs = {
  keyPair: KeyPair;
  walletMasterAddress: string;
  ensDomainData: EnsDomainData;
  factoryContract: Contract;
  relayerAddress: string;
  gasPrice: string;
};

export function createFutureDeploymentWithENS(keyPair: KeyPair, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(keyPair, ensDomainData, walletMasterAddress);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress
  };
}

export function createFutureDeployment(publicKey: string, walletMasterAddress: string, factoryContract: Contract): FutureDeployment {
  const initializeData = encodeInitializeData(publicKey);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, publicKey);
  return {
    initializeData,
    futureAddress
  };
}

export async function createFutureDeploymentWithRefund({keyPair, walletMasterAddress, ensDomainData, factoryContract, relayerAddress, gasPrice}: CreateFutureDeploymentWithRefundArgs): Promise<FutureDeployment> {
  const [, initializeData] = await createProxyDeployWithRefundArgs(keyPair, ensDomainData, walletMasterAddress, relayerAddress, gasPrice);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, keyPair.publicKey);
  return {
    initializeData,
    futureAddress
  };
}

export function getFutureAddress(walletMasterAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  return computeContractAddress(factoryContractAddress, publicKey, initData);
}

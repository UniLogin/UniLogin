import {Contract} from 'ethers';
import {computeContractAddress} from '@universal-login/commons';
import ProxyContract from '../build/KitsuneProxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData, createProxyDeployWithRefundArgs} from '.';

type FutureDeployment = {
  initializeData: string;
  futureAddress: string;
};

export function createFutureDeploymentWithENS(publicKey: string, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(publicKey, ensDomainData, walletMasterAddress);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, publicKey);
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

export function createFutureDeploymentWithRefund(publicKey: string, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract, relayerAddress: string): FutureDeployment {
  const [, initializeData] = createProxyDeployWithRefundArgs(publicKey, ensDomainData, walletMasterAddress, relayerAddress);
  const futureAddress = getFutureAddress(walletMasterAddress, factoryContract.address, publicKey);
  return {
    initializeData,
    futureAddress
  };
}

export function getFutureAddress(walletMasterAddress: string, factoryContractAddress: string, publicKey: string) {
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  return computeContractAddress(factoryContractAddress, publicKey, initData);
}

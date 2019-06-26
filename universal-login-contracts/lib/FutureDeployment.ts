import {Contract} from 'ethers';
import {computeContractAddress} from '@universal-login/commons';
import ProxyContract from '../build/Proxy.json';
import {EnsDomainData, createProxyDeployWithENSArgs, getDeployData, encodeInitializeData, createProxyDeployWithRefundArgs} from '.';

type FutureDeployment = {
  initializeData: string;
  futureAddress: string;
};

export function createFutureDeploymentWithENS(publicKey: string, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract): FutureDeployment {
  const [, initializeData] = createProxyDeployWithENSArgs(publicKey, ensDomainData, walletMasterAddress);
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const futureAddress = computeContractAddress(factoryContract.address, publicKey, initData);
  return {
    initializeData,
    futureAddress
  };
}

export function createFutureDeployment(publicKey: string, walletMasterAddress: string, factoryContract: Contract): FutureDeployment {
  const initializeData = encodeInitializeData(publicKey);
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const futureAddress = computeContractAddress(factoryContract.address, publicKey, initData);
  return {
    initializeData,
    futureAddress
  };
}

export function createFutureDeploymentWithRefund(publicKey: string, walletMasterAddress: string, ensDomainData: EnsDomainData, factoryContract: Contract, relayerAddress: string): FutureDeployment {
  const [, initializeData] = createProxyDeployWithRefundArgs(publicKey, ensDomainData, walletMasterAddress, relayerAddress);
  const initData = getDeployData(ProxyContract as any, [walletMasterAddress, '0x0']);
  const futureAddress = computeContractAddress(factoryContract.address, publicKey, initData);
  return {
    initializeData,
    futureAddress
  };
}

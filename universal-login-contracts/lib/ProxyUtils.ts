import {KeyPair} from '@universal-login/commons';
import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData, encodeInitializeWithRefundData, setupInitializeWithENSAndRefundArgs} from '.';

export function createProxyDeployWithENSArgs(keyPair: KeyPair, ensDomainData: EnsDomainData, walletMasterAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({keyPair, ensDomainData, name});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export function createProxyDeployWithRefundArgs(keyPair: KeyPair, ensDomainData: EnsDomainData, walletMasterAddress: string, gasPrice: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSAndRefundArgs({keyPair, ensDomainData, name, gasPrice});
  const initData = encodeInitializeWithRefundData(walletArgs);
  return [walletMasterAddress, initData];
}

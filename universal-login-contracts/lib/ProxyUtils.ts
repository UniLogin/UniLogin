import {KeyPair} from '@universal-login/commons';
import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData} from '.';

export function createProxyDeployWithENSArgs(keyPair: KeyPair, ensDomainData: EnsDomainData, walletContractAddress: string, gasPrice: string, gasToken: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({keyPair, ensDomainData, name, gasPrice, gasToken});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletContractAddress, initData];
}

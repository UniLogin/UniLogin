import {KeyPair} from '@universal-login/commons';
import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData} from '.';

export function createProxyDeployWithENSArgs(keyPair: KeyPair, ensDomainData: EnsDomainData, walletMasterAddress: string, gasPrice: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({keyPair, ensDomainData, name, gasPrice});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

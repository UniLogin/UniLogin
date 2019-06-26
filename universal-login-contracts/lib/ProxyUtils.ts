import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData} from '.';

export function createProxyDeployWithENSArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({key: publicKey, ensDomainData, name});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

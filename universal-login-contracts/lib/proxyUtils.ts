import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData} from '.';

export function createProxyDeployWithENSArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, relayerAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({key: publicKey, ensDomainData, name, relayerAddress});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

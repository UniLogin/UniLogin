import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData, encodeInitializeWithRefundData} from '.';

export function createProxyDeployWithENSArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({key: publicKey, ensDomainData, name});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export function createProxyDeployWithRefundArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, relayerAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({key: publicKey, ensDomainData, name});
  const initData = encodeInitializeWithRefundData([...walletArgs, relayerAddress]);
  return [walletMasterAddress, initData];
}

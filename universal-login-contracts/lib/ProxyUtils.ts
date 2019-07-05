import {EnsDomainData, setupInitializeWithENSArgs, encodeInitializeWithENSData, encodeInitializeWithRefundData, setupInitializeWithENSAndRefundArgs} from '.';

export function createProxyDeployWithENSArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSArgs({key: publicKey, ensDomainData, name});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletMasterAddress, initData];
}

export function createProxyDeployWithRefundArgs(publicKey: string, ensDomainData: EnsDomainData, walletMasterAddress: string, relayerAddress: string, gasPrice: string, name: string = 'name') {
  const walletArgs = setupInitializeWithENSAndRefundArgs({key: publicKey, ensDomainData, name, relayerAddress, gasPrice});
  const initData = encodeInitializeWithRefundData(walletArgs);
  return [walletMasterAddress, initData];
}

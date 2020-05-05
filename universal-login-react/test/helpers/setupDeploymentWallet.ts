import {DeployedWallet, SdkConfig} from '@unilogin/sdk';
import {setupSdk, createWallet} from '@unilogin/sdk/testutils';
import {mockSdkPrices} from './mockSdkPrices';
import {Wallet} from 'ethers';

export const setupDeployedWallet = async (wallet: Wallet, ensName: string, overrideSdkConfig?: Partial<SdkConfig>) => {
  const {relayer, sdk} = await setupSdk(wallet, '33113', overrideSdkConfig);
  mockSdkPrices(sdk);
  await sdk.start();
  const {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  return {deployedWallet, relayer, sdk};
};

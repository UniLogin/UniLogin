import {DeployedWallet, SdkConfig} from '@unilogin/sdk';
import {setupSdk, createWallet} from '@unilogin/sdk/testutils';
import {Wallet} from 'ethers';

export const setupDeployedWallet = async (wallet: Wallet, ensName: string, overrideSdkConfig?: Partial<SdkConfig>) => {
  const {relayer, sdk, mockToken} = await setupSdk(wallet, '33113', overrideSdkConfig);
  await sdk.start();
  const {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk, 'user@unilogin.test');
  return {deployedWallet, relayer, sdk, mockToken};
};

import {DeployedWallet} from '@universal-login/sdk';
import {setupSdk, createWallet} from '@universal-login/sdk/testutils';
import {mockSdkPrices} from './mockSdkPrices';
import {Wallet} from 'ethers';

export const setupDeployedWallet = async (wallet: Wallet, ensName: string) => {
  const {relayer, sdk} = await setupSdk(wallet, '33113');
  mockSdkPrices(sdk);
  await sdk.start();
  const {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  return {deployedWallet, relayer};
};

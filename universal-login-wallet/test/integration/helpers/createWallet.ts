import {Wallet, utils} from 'ethers';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';

export const createWallet = async (name: string, sdk: UniversalLoginSDK, wallet: Wallet) => {
  const {contractAddress, waitForBalance, deploy, privateKey} = await sdk.createFutureWallet();
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  await deploy(name, '1');
  return {contractAddress, privateKey, name};
};

export const createAndSetWallet = async (name: string, sdk: UniversalLoginSDK,  wallet: Wallet, walletService: WalletService) => {
  const applicationWallet = await createWallet(name, sdk, wallet);
  walletService.connect(applicationWallet);
  return applicationWallet;
}
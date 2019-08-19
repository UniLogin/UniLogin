import {Wallet, utils} from 'ethers';
import {WalletService} from '../../lib/core/services/WalletService';
import UniversalLoginSDK from '../../lib';

export const createWallet = async (name: string, sdk: UniversalLoginSDK, wallet: Wallet) => {
  const {contractAddress, waitForBalance, deploy, privateKey} = await sdk.createFutureWallet();
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  await deploy(name, '1');
  return {contractAddress, privateKey};
};

export const createAndSetWallet = async (name: string, walletService: WalletService, wallet: Wallet, sdk: UniversalLoginSDK) => {
  const {privateKey, contractAddress} = await createWallet(name, sdk, wallet);
  walletService.connect({privateKey, contractAddress, name});
  return {contractAddress, privateKey, walletService};
}

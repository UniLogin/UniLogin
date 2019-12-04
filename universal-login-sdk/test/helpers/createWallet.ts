import {Wallet, utils} from 'ethers';
import {WalletService} from '../../lib/core/services/WalletService';
import UniversalLoginSDK, {DeployedWallet} from '../../lib';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@universal-login/commons';

export const createWallet = async (name: string, sdk: UniversalLoginSDK, wallet: Wallet): Promise<DeployedWallet> => {
  const {contractAddress, waitForBalance, deploy, privateKey} = await sdk.createFutureWallet();
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  const {waitToBeSuccess} = await deploy(name, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
  await waitToBeSuccess();
  return new DeployedWallet(contractAddress, name, privateKey, sdk);
};

export const createAndSetWallet = async (name: string, walletService: WalletService, wallet: Wallet, sdk: UniversalLoginSDK) => {
  const {privateKey, contractAddress} = await createWallet(name, sdk, wallet);
  walletService.setWallet({privateKey, contractAddress, name});
  return {contractAddress, privateKey, walletService};
};

import {Wallet, utils} from 'ethers';
import {WalletService} from '../../src/core/services/WalletService';
import UniversalLoginSDK, {DeployedWallet} from '../../src';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';

export const createdDeployedWallet = async (name: string, sdk: UniversalLoginSDK, wallet: Wallet): Promise<DeployedWallet> => {
  const {contractAddress, waitForBalance, deploy} = await sdk.createFutureWallet(name, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  const {waitToBeSuccess} = await deploy();
  return waitToBeSuccess();
};

export const createAndSetWallet = async (name: string, walletService: WalletService, wallet: Wallet, sdk: UniversalLoginSDK) => {
  const {privateKey, contractAddress} = await createdDeployedWallet(name, sdk, wallet);
  walletService.setWallet({privateKey, contractAddress, name});
  return {contractAddress, privateKey, walletService};
};

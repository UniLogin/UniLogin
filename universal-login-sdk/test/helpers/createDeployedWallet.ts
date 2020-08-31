import {Wallet, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, ensure} from '@unilogin/commons';
import {WalletService} from '../../src/core/services/WalletService';
import UniLoginSdk, {DeployedWallet} from '../../src';

export const createdDeployedWallet = async (name: string, sdk: UniLoginSdk, wallet: Wallet, email = 'test@unilogin.email'): Promise<DeployedWallet> => {
  const {contractAddress, waitForBalance, deploy} = await sdk.createFutureWallet(name, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address, email);
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  const {waitToBeSuccess} = await deploy();
  const deployedWallet = await waitToBeSuccess();
  ensure(deployedWallet instanceof DeployedWallet, Error, 'Created wallet is not instance of DeployedWallet');
  return deployedWallet;
};

export const createAndSetWallet = async (name: string, walletService: WalletService, wallet: Wallet, sdk: UniLoginSdk) => {
  const {privateKey, contractAddress} = await createdDeployedWallet(name, sdk, wallet);
  walletService.setWallet({privateKey, contractAddress, name});
  return {contractAddress, privateKey, walletService};
};

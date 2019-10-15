import {utils, Wallet} from 'ethers';
import UniversalLoginSDK from '@universal-login/sdk';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@universal-login/commons';

export const createWallet = async (name: string, sdk: UniversalLoginSDK, wallet: Wallet) => {
  const {contractAddress, waitForBalance, deploy} = await sdk.createFutureWallet();
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  const {waitToBeSuccess} = await deploy(name, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
  const deployedWallet = await waitToBeSuccess();
  return deployedWallet;
};

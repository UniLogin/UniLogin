import {Wallet, utils} from 'ethers';
import {TEST_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import UniversalLoginSDK from '../../src';

export const createDeployedWallet = async (ensName: string, sdk: UniversalLoginSDK, deployer: Wallet) => {
  const {contractAddress, waitForBalance, deploy} = await sdk.createFutureWallet();
  await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
  await waitForBalance();
  const {waitToBeSuccess} = await deploy(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
  return waitToBeSuccess();
};

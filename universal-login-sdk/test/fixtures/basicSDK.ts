import {utils, providers, Contract, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, TEST_SDK_CONFIG} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../lib/api/sdk';
import {SdkConfigDefault} from '../../lib/config/SdkConfigDefault';
import {createWallet} from '../helpers/createWallet';

export default async function basicSDK(givenProvider: providers.Provider, wallets: Wallet[]) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;
  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  const sdk = new UniversalLoginSDK(relayer.url(), provider, TEST_SDK_CONFIG);
  const ensName = 'alex.mylogin.eth';
  const  {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  const walletContract = new Contract(contractAddress, WalletContract.abi, wallet);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer, ensName};
}

export const transferMessage = {
  ...SdkConfigDefault.paymentOptions,
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5').toString()
};

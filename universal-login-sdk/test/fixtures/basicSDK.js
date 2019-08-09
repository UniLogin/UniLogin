import UniversalLoginSDK from '../../lib/api/sdk';
import {RelayerUnderTest} from '@universal-login/relayer';
import {deployContract} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import MockToken from '@universal-login/contracts/build/MockToken';
import {SdkConfigDefault} from '../../lib/config/SdkConfigDefault';

export default async function basicWalletService(givenProvider, wallets) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;
  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  const ensName = 'alex.mylogin.eth';
  const [privateKey, contractAddress] = await sdk.create(ensName);
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
  const walletContract = new Contract(contractAddress, WalletContract.abi, wallet);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer, ensName};
}

export const transferMessage = {
  ...SdkConfigDefault.paymentOptions,
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5').toString(),
};

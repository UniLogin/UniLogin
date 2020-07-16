import {utils, Contract, Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, TEST_SDK_CONFIG} from '@unilogin/commons';
import {gnosisSafe} from '@unilogin/contracts';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSdk from '../../src/api/sdk';
import {createdDeployedWallet} from '../helpers/createDeployedWallet';

export default async function basicSDK(mockProvider: MockProvider, wallets: Wallet[]) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;
  const {relayer, provider, mockToken} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  (provider as any).pollingInterval = 10;
  const sdk = new UniLoginSdk(relayer.url(), provider, TEST_SDK_CONFIG);
  await sdk.fetchRelayerConfig();
  const ensName = 'alex.mylogin.eth';
  const {contractAddress, privateKey} = await createdDeployedWallet(ensName, sdk, wallet);
  await mockToken.transfer(contractAddress, utils.parseEther('3.0'));
  const walletContract = new Contract(contractAddress, gnosisSafe.GnosisSafe.abi, wallet);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer, ensName};
}

export const transferMessage = {
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
  gasToken: ETHER_NATIVE_TOKEN.address,
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5').toString(),
};

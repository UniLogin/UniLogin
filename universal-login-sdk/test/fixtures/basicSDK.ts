import {utils, providers, Contract, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, TEST_SDK_CONFIG} from '@universal-login/commons';
import {beta2} from '@universal-login/contracts';
import {mockContracts} from '@universal-login/contracts/testutils';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../src/api/sdk';
import {createWallet} from '../helpers/createWallet';

export default async function basicSDK(givenProvider: providers.Provider, wallets: Wallet[]) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;
  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();
  const sdk = new UniversalLoginSDK(relayer.url(), provider, TEST_SDK_CONFIG);
  await sdk.fetchRelayerConfig();
  const ensName = 'alex.mylogin.eth';
  const {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const mockToken = await deployContract(wallet, mockContracts.MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  const walletContract = new Contract(contractAddress, beta2.WalletContract.abi, wallet);
  return {wallet, provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer, ensName};
}

export const transferMessage = {
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
  gasToken: ETHER_NATIVE_TOKEN.address,
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5').toString(),
};

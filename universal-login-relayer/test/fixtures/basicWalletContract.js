import {utils} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, EMPTY_DATA} from '@universal-login/commons';
import {deployFactory} from '@universal-login/contracts';
import {encodeFunction} from '@universal-login/contracts/testutils';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import defaultPaymentOptions from '../../lib/config/defaultPaymentOptions';
import createWalletContract from '../helpers/createWalletContract';
import buildEnsService from '../helpers/buildEnsService';

const {gasPrice, gasLimit} = defaultPaymentOptions;

export default async function basicWalletContract(provider, wallets) {
  const [ , , wallet] = wallets;
  const [ensService, provider] = await buildEnsService(wallet, 'mylogin.eth');
  const factoryContract = await deployFactory(wallet, walletContract.address);
  const {proxy: walletContract} = await createWalletContract(wallet);
  return {wallet, provider, walletContract, ensService, walletContractAddress: walletContract.address, factoryContractAddress: factoryContract.address};
}

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: EMPTY_DATA,
  nonce: '0',
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

const addKeyMessageDataField = encodeFunction(WalletContract, 'addKey', ['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0']);
export const addKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: addKeyMessageDataField,
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

const removeKeyMessageDataField = encodeFunction(WalletContract, 'removeKey', ['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0']);
export const removeKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: removeKeyMessageDataField,
  nonce: 1,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

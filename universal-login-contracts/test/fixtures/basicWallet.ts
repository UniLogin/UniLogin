import ERC1077 from '../../build/ERC1077.json';
import MockToken from '../../build/MockToken.json';
import MockContract from '../../build/MockContract.json';
import {utils, Wallet, providers} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import {ACTION_KEY, OPERATION_CALL, TEST_ACCOUNT_ADDRESS, sortPrivateKeysByAddress} from '@universal-login/commons';
const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export default async function basicWallet(unusedProvider : providers.Provider, [, , , , , , , , , wallet] : Wallet []) {
  const actionWallet1 = Wallet.createRandom();
  const actionWallet2 = Wallet.createRandom();
  const sortedKeys = sortPrivateKeysByAddress([actionWallet1.privateKey, actionWallet2.privateKey, wallet.privateKey]);
  const publicActionKey1 = actionWallet1.address;
  const publicActionKey2 = actionWallet2.address;
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const walletContract = await deployContract(wallet, ERC1077, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContract.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContract.address, parseEther('1.0'));
  await walletContract.addKey(publicActionKey1, ACTION_KEY);
  await walletContract.addKey(publicActionKey2, ACTION_KEY);
  return {provider, publicKey, privateKey, sortedKeys, keyAsAddress, walletContract, mockToken, mockContract, wallet};
}

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};


export const failedTransferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.callMe.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.revertingFunction.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

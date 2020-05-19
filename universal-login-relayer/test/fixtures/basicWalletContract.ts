import {utils} from 'ethers';
import {EMPTY_DATA, TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_LIMIT, OperationType, TEST_GAS_PRICE} from '@unilogin/commons';
import {encodeFunction} from '@unilogin/contracts/testutils';
import {beta2} from '@unilogin/contracts';

const gasPrice = utils.bigNumberify(TEST_GAS_PRICE);
const gasLimit = utils.bigNumberify(DEFAULT_GAS_LIMIT);

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: EMPTY_DATA,
  nonce: '0',
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OperationType.call,
};

const addKeyMessageDataField = encodeFunction(beta2.WalletContract, 'addKey', ['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0']);
export const addKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: addKeyMessageDataField,
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OperationType.call,
};

const removeKeyMessageDataField = encodeFunction(beta2.WalletContract, 'removeKey', ['0x63FC2aD3d021a4D7e64323529a55a9442C444dA0']);
export const removeKeyMessage = {
  to: '0x0000000000000000000000000000000000000000',
  value: utils.parseEther('0.0'),
  data: removeKeyMessageDataField,
  nonce: 1,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
};

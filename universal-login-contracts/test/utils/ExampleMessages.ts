import {OPERATION_CALL, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {utils} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import MockContract from '../../build/MockContract.json';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

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

import {TEST_ACCOUNT_ADDRESS, UnsignedMessage} from '@universal-login/commons';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import MockContract from '../../build/MockContract.json';
import {encodeFunction} from '../helpers/argumentsEncoding';
import Loop from '../../build/Loop.json';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};


export const failedTransferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.callMe.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.revertingFunction.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000'
};

type InfiniteCallOverrides = {
  from: string;
  gasToken?: string;
};

export const createInfiniteCallMessage = async (deployer: Wallet, overrides: InfiniteCallOverrides): Promise<UnsignedMessage> => {
  const loopContract = await deployContract(deployer, Loop);
  const loopFunctionData = encodeFunction(Loop, 'loop');
  return {
    to: loopContract.address,
    value: utils.parseEther('0'),
    data: loopFunctionData,
    nonce: 0,
    gasPrice: 1,
    gasToken: '0x0',
    gasLimit: utils.bigNumberify('240000'),
    ...overrides
  };
};

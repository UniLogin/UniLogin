import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, calculateMessageSignature, DEFAULT_GAS_LIMIT_EXECUTION} from '@universal-login/commons';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import TEST_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import MockContract from '../../build/MockContract.json';
import {encodeFunction, getExecutionArgs} from '../helpers/argumentsEncoding';
import Loop from '../../build/Loop.json';
import {calculatePaymentOptions, estimateGasDataFromUnsignedMessage} from '../../lib/estimateGas';

const {parseEther} = utils;
const {gasPrice} = TEST_PAYMENT_OPTIONS;

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
  gasData: '7440',
  gasToken: '0x0000000000000000000000000000000000000000'
};


export const failedTransferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
  gasData: '7440',
  gasToken: '0x0000000000000000000000000000000000000000'
};

const callMeMessageData = encodeFunction(MockContract, 'callMe');
export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: callMeMessageData,
  nonce: 0,
  gasPrice,
  gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
  gasData: '8720',
  gasToken: '0x0000000000000000000000000000000000000000'
};

const revertingFunctionMessageData = encodeFunction(MockContract, 'revertingFunction');
export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: revertingFunctionMessageData,
  nonce: 0,
  gasPrice,
  gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
  gasData: '8720',
  gasToken: '0x0000000000000000000000000000000000000000'
};

type InfiniteCallOverrides = {
  from: string;
  gasToken?: string;
};

export const createInfiniteCallMessage = async (deployer: Wallet, overrides: InfiniteCallOverrides): Promise<UnsignedMessage> => {
  const loopContract = await deployContract(deployer, Loop);
  const loopMessageData = encodeFunction(Loop, 'loop');
  const msg = {
    to: loopContract.address,
    value: utils.parseEther('0'),
    data: loopMessageData,
    nonce: 0,
    gasPrice: 1,
    gasToken: '0x0',
    gasLimitExecution: utils.bigNumberify('240000'),
    gasData: 0,
    ...overrides
  };
  const gasData = estimateGasDataFromUnsignedMessage(msg);
  return {...msg, gasData};
};

export const executeSetRequiredSignatures = async (proxyAsWalletContract: Contract, requiredSignatures: number, privateKey: string) => {
  const setRequiredSignaturesMessageData = proxyAsWalletContract.interface.functions.setRequiredSignatures.encode([requiredSignatures]);
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: setRequiredSignaturesMessageData,
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
    gasData: 0,
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const gasData = estimateGasDataFromUnsignedMessage(msg);
  msg.gasData = gasData;
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
};

export const executeAddKey = async (proxyAsWalletContract: Contract, newKey: string, privateKey: string) => {
  const addKeyMessageData = proxyAsWalletContract.interface.functions.addKey.encode([newKey]);
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: addKeyMessageData,
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimitExecution: DEFAULT_GAS_LIMIT_EXECUTION,
    gasData: 0,
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const gasData = estimateGasDataFromUnsignedMessage(msg);
  msg.gasData = gasData;
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
};

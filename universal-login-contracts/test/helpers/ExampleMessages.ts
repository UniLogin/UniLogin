import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, calculateMessageSignature, computeGasData} from '@universal-login/commons';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import TEST_PAYMENT_OPTIONS, {TEST_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../lib/defaultPaymentOptions';
import MockContract from '../../build/MockContract.json';
import {encodeFunction, getExecutionArgs} from '../helpers/argumentsEncoding';
import Loop from '../../build/Loop.json';

const {parseEther} = utils;
const {gasPrice, gasLimit} = TEST_PAYMENT_OPTIONS;

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: 0,
  gasToken: '0x0000000000000000000000000000000000000000'
};


export const failedTransferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: 0,
  gasToken: '0x0000000000000000000000000000000000000000'
};

const callMeMessageData = encodeFunction(MockContract, 'callMe');
export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: callMeMessageData,
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: computeGasData(callMeMessageData),
  gasToken: '0x0000000000000000000000000000000000000000'
};

const revertingFunctionMessageData = encodeFunction(MockContract, 'revertingFunction');
export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: revertingFunctionMessageData,
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: computeGasData(revertingFunctionMessageData),
  gasToken: '0x0000000000000000000000000000000000000000'
};

type InfiniteCallOverrides = {
  from: string;
  gasToken?: string;
};

export const createInfiniteCallMessage = async (deployer: Wallet, overrides: InfiniteCallOverrides): Promise<UnsignedMessage> => {
  const loopContract = await deployContract(deployer, Loop);
  const loopMessageData = encodeFunction(Loop, 'loop');
  return {
    to: loopContract.address,
    value: utils.parseEther('0'),
    data: loopMessageData,
    nonce: 0,
    gasPrice: 1,
    gasToken: '0x0',
    gasLimitExecution: utils.bigNumberify('240000'),
    gasData: computeGasData(loopMessageData),
    ...overrides
  };
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
    gasLimitExecution: gasLimit,
    gasData: computeGasData(setRequiredSignaturesMessageData),
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, TEST_PAYMENT_OPTIONS_NO_GAS_TOKEN);
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
    gasLimitExecution: gasLimit,
    gasData: computeGasData(addKeyMessageData),
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, TEST_PAYMENT_OPTIONS_NO_GAS_TOKEN);
};

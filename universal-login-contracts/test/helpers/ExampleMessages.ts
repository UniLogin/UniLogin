import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, calculateMessageSignature, computeGasData} from '@universal-login/commons';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import DEFAULT_PAYMENT_OPTIONS, {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../lib/defaultPaymentOptions';
import MockContract from '../../build/MockContract.json';
import {encodeFunction, getExecutionArgs} from '../helpers/argumentsEncoding';
import Loop from '../../build/Loop.json';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

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

const callMessageDataField = new utils.Interface(MockContract.abi).functions.callMe.encode([]);
export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: callMessageDataField,
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: computeGasData(callMessageDataField),
  gasToken: '0x0000000000000000000000000000000000000000'
};

const failedCallMessageDataField = new utils.Interface(MockContract.abi).functions.revertingFunction.encode([]);
export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: failedCallMessageDataField,
  nonce: 0,
  gasPrice,
  gasLimitExecution: gasLimit,
  gasData: computeGasData(failedCallMessageDataField),
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
    gasLimitExecution: utils.bigNumberify('240000'),
    gasData: computeGasData(loopFunctionData),
    ...overrides
  };
};

export const executeSetRequiredSignatures = async (proxyAsWalletContract: Contract, requiredSignatures: number, privateKey: string) => {
  const setRequiredSignatureMessageDataField = proxyAsWalletContract.interface.functions.setRequiredSignatures.encode([requiredSignatures]);
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: setRequiredSignatureMessageDataField,
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimitExecution: gasLimit,
    gasData: computeGasData(setRequiredSignatureMessageDataField),
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
};

export const executeAddKey = async (proxyAsWalletContract: Contract, newKey: string, privateKey: string) => {
  const addKeyMessageDataField = proxyAsWalletContract.interface.functions.addKey.encode([newKey]);
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: addKeyMessageDataField,
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimitExecution: gasLimit,
    gasData: computeGasData(addKeyMessageDataField),
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
};

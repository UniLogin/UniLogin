import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, calculateMessageSignature} from '@universal-login/commons';
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

export const setRequiredSignaturesMsg = async (proxyAsWalletContract: Contract, requiredSignatures: number, privateKey: string) => {
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: proxyAsWalletContract.interface.functions.setRequiredSignatures.encode([requiredSignatures]),
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimit,
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
}

export const addKeyMsg = async (proxyAsWalletContract: Contract, newKey: string, privateKey: string) => {
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data: proxyAsWalletContract.interface.functions.addKey.encode([newKey]),
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    gasPrice,
    gasLimit,
    gasToken: '0x0000000000000000000000000000000000000000'
  };
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN);
}

import {TEST_ACCOUNT_ADDRESS, UnsignedMessage, calculateMessageSignature, DEFAULT_GAS_LIMIT_EXECUTION, GAS_FIXED, OperationType, EMPTY_DATA, ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT, TEST_GAS_PRICE} from '@unilogin/commons';
import {utils, Wallet, Contract} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import MockContract from '../../dist/contracts/MockContract.json';
import {encodeFunction, getExecutionArgs} from '../helpers/argumentsEncoding';
import Loop from '../../dist/contracts/Loop.json';
import {calculateBaseGas} from '../../src/estimateGas';
import {calculatePaymentOptions} from '../helpers/calculations';
import {AddressZero} from 'ethers/constants';

const {parseEther, bigNumberify} = utils;

export const emptyMessage = {
  to: '',
  value: parseEther('0.0'),
  data: EMPTY_DATA,
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: bigNumberify(TEST_GAS_PRICE),
  gasLimit: bigNumberify(DEFAULT_GAS_LIMIT),
  gasToken: ETHER_NATIVE_TOKEN.address,
};

export const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: TEST_GAS_PRICE,
  safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
  baseGas: utils.bigNumberify('7440').add(GAS_FIXED),
  gasToken: '0x0000000000000000000000000000000000000000',
};

export const failedTransferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: TEST_GAS_PRICE,
  safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
  baseGas: utils.bigNumberify('7440').add(GAS_FIXED),
  gasToken: '0x0000000000000000000000000000000000000000',
};

const callMeMessageData = encodeFunction(MockContract, 'callMe');
export const callMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: callMeMessageData,
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: TEST_GAS_PRICE,
  safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
  baseGas: utils.bigNumberify('8720').add(GAS_FIXED),
  gasToken: '0x0000000000000000000000000000000000000000',
};

const revertingFunctionMessageData = encodeFunction(MockContract, 'revertingFunction');
export const failedCallMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: parseEther('0.0'),
  data: revertingFunctionMessageData,
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
  gasPrice: TEST_GAS_PRICE,
  safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
  baseGas: utils.bigNumberify('8720').add(GAS_FIXED),
  gasToken: '0x0000000000000000000000000000000000000000',
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
    operationType: OperationType.call,
    refundReceiver: AddressZero,
    gasPrice: 1,
    gasToken: '0x0',
    safeTxGas: utils.bigNumberify('240000'),
    baseGas: utils.bigNumberify(0).add(GAS_FIXED),
    ...overrides,
  };
  const baseGas = calculateBaseGas(msg, 'constantinople', 'beta2');
  return {...msg, baseGas};
};

export const executeSetRequiredSignatures = async (proxyAsWalletContract: Contract, requiredSignatures: number, privateKey: string) => {
  const setRequiredSignaturesMessageData = proxyAsWalletContract.interface.functions.setRequiredSignatures.encode([requiredSignatures]);
  return selfExecute(proxyAsWalletContract, setRequiredSignaturesMessageData, privateKey);
};

export const executeAddKey = async (proxyAsWalletContract: Contract, newKey: string, privateKey: string) => {
  const addKeyMessageData = proxyAsWalletContract.interface.functions.addKey.encode([newKey]);
  return selfExecute(proxyAsWalletContract, addKeyMessageData, privateKey);
};

export const selfExecute = async (proxyAsWalletContract: Contract, data: string, privateKey: string) => {
  const msg = {
    from: proxyAsWalletContract.address,
    to: proxyAsWalletContract.address,
    data,
    value: parseEther('0.0'),
    nonce: await proxyAsWalletContract.lastNonce(),
    operationType: OperationType.call,
    refundReceiver: AddressZero,
    gasPrice: TEST_GAS_PRICE,
    safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
    baseGas: utils.bigNumberify(0).add(GAS_FIXED),
    gasToken: '0x0000000000000000000000000000000000000000',
  };
  const baseGas = utils.bigNumberify(calculateBaseGas(msg, 'constantinople', 'beta2'));
  msg.baseGas = baseGas;
  const signature = calculateMessageSignature(privateKey, msg);
  return proxyAsWalletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg));
};

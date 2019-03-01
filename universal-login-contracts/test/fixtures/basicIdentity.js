import ERC1077ApprovalScheme from '../../build/ERC1077';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {addressToBytes32} from '../utils';
import {OPERATION_CALL, ECDSA_TYPE, MANAGEMENT_KEY} from '../../lib/consts';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export default async function basicIdentity(provider, [, , , , , , , , , wallet]) {
  const publicKey = addressToBytes32(wallet.address);
  const actionWallet = Wallet.createRandom();
  const publicActionKey = addressToBytes32(actionWallet.address);
  const privateActionKey = actionWallet.privateKey;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = addressToBytes32(wallet.privateKey);
  const identity = await deployContract(wallet, ERC1077ApprovalScheme, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: identity.address, value: parseEther('2.0')});
  await mockToken.transfer(identity.address, parseEther('1.0'));
  await identity.addKey(publicActionKey, MANAGEMENT_KEY, ECDSA_TYPE);
  return {provider, publicKey, privateKey, privateActionKey, keyAsAddress, identity, mockToken, mockContract, wallet};
}

export const transferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};


export const failedTransferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const callMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.callMe.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

export const failedCallMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('0.0'),
  data: new utils.Interface(MockContract.abi).functions.revertingFunction.encode([]),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

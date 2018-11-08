import ERC1077ApprovalScheme from '../../build/ERC1077';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import ethers, {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {addressToBytes32} from '../utils';
import {OPERATION_CALL} from '../../lib/consts';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export default async function basicIdentity(provider, wallet) {
  const publicKey = addressToBytes32(wallet.address);
  const keyAsAddress = wallet.address;
  const privateKey = addressToBytes32(wallet.privateKey);
  const identity = await deployContract(wallet, ERC1077ApprovalScheme, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.send(identity.address, parseEther('2.0'));
  await mockToken.transfer(identity.address, parseEther('1.0'));
  return {publicKey, privateKey, keyAsAddress, identity, mockToken, mockContract, wallet};
}

export const transferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL
};


export const failedTransferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('10.0'),
  data: [],
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL
};

export const callMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('0.0'),
  data: new ethers.Interface(MockContract.interface).functions.callMe().data,
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL
};

export const failedCallMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('0.0'),
  data: new ethers.Interface(MockContract.interface).functions.revertingFunction().data,
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL
};

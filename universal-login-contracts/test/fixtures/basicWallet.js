import ERC1077 from '../../build/ERC1077';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {OPERATION_CALL, ACTION_KEY} from '../../lib/consts';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import {sortPrivateKeysByAddress} from '../../lib/calculateMessageSignature';
const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export default async function basicWallet(provider, [, , , , , , , , , wallet]) {
  const actionWallet1 = Wallet.createRandom();
  const actionWallet2 = Wallet.createRandom();
  const sortedKeys = sortPrivateKeysByAddress([actionWallet1.privateKey, actionWallet2.privateKey, wallet.privateKey]);
  const publicActionKey1 = actionWallet1.address;
  const publicActionKey2 = actionWallet2.address;
  const publicKey = wallet.address;
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = wallet.privateKey;
  const walletContract = await deployContract(wallet, ERC1077, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: walletContract.address, value: parseEther('2.0')});
  await mockToken.transfer(walletContract.address, parseEther('1.0'));
  await walletContract.addKey(publicActionKey1, ACTION_KEY);
  await walletContract.addKey(publicActionKey2, ACTION_KEY);
  return {provider, publicKey, privateKey, sortedKeys, keyAsAddress, identity: walletContract, mockToken, mockContract, wallet};
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

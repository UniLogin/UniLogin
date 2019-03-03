import ERC1077ApprovalScheme from '../../build/ERC1077';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import {utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {addressToBytes32} from '../utils';
import {OPERATION_CALL, ACTION_KEY} from '../../lib/consts';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';

const {parseEther} = utils;
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

export default async function basicIdentity(provider, [, , , , , , , , , wallet]) {
  const publicKey = addressToBytes32(wallet.address);
  const actionWallet1 = Wallet.createRandom();
  const actionWallet2 = Wallet.createRandom();
  const sortedWallets = [actionWallet1, actionWallet2, wallet].sort((wallet1, wallet2) => {
    const address1 = parseInt(wallet1.address, 16);
    const address2 = parseInt(wallet2.address, 16);
    if (address1 > address2) {
      return 1;
    } else if (address1 < address2) {
      return -1;
    } else {
      return 0;
    }
  })
  const publicActionKey1 = addressToBytes32(actionWallet1.address);
  const publicActionKey2 = addressToBytes32(actionWallet2.address);
  const sortedKeys = [sortedWallets[0].privateKey, sortedWallets[1].privateKey, sortedWallets[2].privateKey];
  const keyAsAddress = wallet.address;
  const {provider} = wallet;
  const privateKey = addressToBytes32(wallet.privateKey);
  const identity = await deployContract(wallet, ERC1077ApprovalScheme, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.sendTransaction({to: identity.address, value: parseEther('2.0')});
  await mockToken.transfer(identity.address, parseEther('1.0'));
  await identity.addKey(publicActionKey1, ACTION_KEY);
  await identity.addKey(publicActionKey2, ACTION_KEY);
  return {provider, publicKey, privateKey, sortedKeys, keyAsAddress, identity, mockToken, mockContract, wallet};
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

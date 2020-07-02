import {utils} from 'ethers';
import {expect} from 'chai';
import {SignedMessage, TEST_CONTRACT_ADDRESS, Message, TEST_ACCOUNT_ADDRESS, EMPTY_DATA, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, TEST_PRIVATE_KEY, OperationType, TEST_GAS_PRICE} from '@unilogin/commons';
import {messageToUnsignedMessage, unsignedMessageToSignedMessage, messageToSignedMessage} from '../src/message';
import {AddressZero} from 'ethers/constants';

const {bigNumberify} = utils;

const message: Partial<Message> = {
  from: TEST_CONTRACT_ADDRESS,
  to: TEST_CONTRACT_ADDRESS,
  value: utils.parseEther('1'),
  gasPrice: TEST_GAS_PRICE,
  gasToken: ETHER_NATIVE_TOKEN.address,
  data: '0xbeef',
  gasLimit: bigNumberify(100000),
  nonce: 0,
  operationType: OperationType.call,
  refundReceiver: AddressZero,
};

describe('Message', () => {
  it('messageToSignedMessage for constantinople', () => {
    const networkVersion = 'constantinople';
    const walletVersion = 'beta2';
    const actualMessage = messageToSignedMessage(message, TEST_PRIVATE_KEY, networkVersion, walletVersion);
    const expectedMessage = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      baseGas: bigNumberify(58976),
      safeTxGas: bigNumberify(41024),
      signature: '0x1fce98883281aecb5bc672d08a06daea2393d53aa7a26c3a5c3f9bdf0aad763e415bfc3fce34ac0c9f4b6cfed37b3e38cecfbdda69c4963293d4cafe11124a4f1b',
    };
    expect(actualMessage).to.deep.eq(expectedMessage);
  });

  it('messageToSignedMessage for istanbul', () => {
    const networkVersion = 'istanbul';
    const walletVersion = 'beta2';
    const actualMessage = messageToSignedMessage(message, TEST_PRIVATE_KEY, networkVersion, walletVersion);
    const expectedMessage = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      baseGas: bigNumberify(53152),
      safeTxGas: bigNumberify(46848),
      signature: '0x46ccbc0739f5cbd788f107f40f06d91afdc6e7e26921768f10f1558ed019a703197cac36843e048fe217346a544501f987c6d583ab7b5358f8c8f37183c82a2e1c',
    };
    expect(actualMessage).to.deep.eq(expectedMessage);
  });

  it('messageToUnsignedMessage for constantinople', async () => {
    const networkVersion = 'constantinople';
    const walletVersion = 'beta2';
    const expectedUnsignedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      baseGas: bigNumberify(58976),
      safeTxGas: bigNumberify(100000 - 58976),
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };

    const actualUnsginedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
    expect(actualUnsginedMessage).to.deep.eq(expectedUnsignedMessage);
  });

  it('messageToUnsignedMessage for istanbul', async () => {
    const networkVersion = 'istanbul';
    const walletVersion = 'beta2';
    const expectedUnsignedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      baseGas: bigNumberify(53152),
      safeTxGas: bigNumberify(100000 - 53152),
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };

    const actualUnsginedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
    expect(actualUnsginedMessage).to.deep.eq(expectedUnsignedMessage);
  });

  it('unsignedMessageToSignedMessage', async () => {
    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      gasPrice: TEST_GAS_PRICE,
      safeTxGas: DEFAULT_GAS_LIMIT,
      baseGas: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
    };

    const expectedMessage = {
      from: '0x',
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      gasPrice: transferMessage.gasPrice,
      safeTxGas: transferMessage.safeTxGas,
      baseGas: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      signature: '0xf3a61b7537ac2025dda47ad00145afa805202c9a7c23ecd1defa1f24d6be6f242a02db2a4a3108c6363b338b8ea172315725644ebbba201bd3a224c18eb54e4f1c',
    };

    const signedMessage = unsignedMessageToSignedMessage({...transferMessage, from: '0x'}, TEST_PRIVATE_KEY);
    expect(signedMessage).to.deep.eq(expectedMessage);
  });

  it('messageToSignedMessage for istanbul and beta3', async () => {
    const networkVersion = 'istanbul';
    const walletVersion = 'beta3';
    const actualMessage = messageToSignedMessage(message, TEST_PRIVATE_KEY, networkVersion, walletVersion);
    const expectedMessage = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      baseGas: bigNumberify(84252),
      safeTxGas: bigNumberify(15748),
      signature: '0x0fdf34280d208231eedceb138737eef6875530f3e017ee3e88dea6c168473f022c983dec6022f1a892427945b36ca0972c8a6864cbaa42d7dc947ac1b8642c461b',
    };
    expect(actualMessage).to.deep.eq(expectedMessage);
  });
});

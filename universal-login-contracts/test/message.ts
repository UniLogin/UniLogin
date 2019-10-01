import {utils} from 'ethers';
import {expect} from 'chai';
import {SignedMessage, TEST_CONTRACT_ADDRESS, Message, TEST_ACCOUNT_ADDRESS, EMPTY_DATA, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import TEST_PAYMENT_OPTIONS from '../lib/defaultPaymentOptions';
import {messageToUnsignedMessage, createSignedMessage} from '../lib/message';

const {bigNumberify} = utils;

describe('messageToUnsignedMessage', () => {
  it('correct transform', async () => {
    const incomingMessage: Partial<Message> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_PAYMENT_OPTIONS.gasPrice,
      gasToken: TEST_PAYMENT_OPTIONS.gasToken,
      data: '0xbeef',
      gasLimit: bigNumberify(100000),
      nonce: 0
    };

    const expectedUnsignedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: TEST_PAYMENT_OPTIONS.gasPrice,
      gasToken: TEST_PAYMENT_OPTIONS.gasToken,
      data: '0xbeef',
      gasData: bigNumberify(8976),
      gasLimitExecution: bigNumberify(100000 - 8976),
      nonce: 0,
    };

    const actualUnsginedMessage = messageToUnsignedMessage(incomingMessage);

    expect(actualUnsginedMessage).to.deep.equal(expectedUnsignedMessage);
  });
});

describe('createSignedMessage', async () => {
  it('sign a message', async () => {
    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      gasPrice: DEFAULT_GAS_PRICE,
      gasLimitExecution: DEFAULT_GAS_LIMIT,
      gasData: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
    };

    const expectedMessage = {
      from: '0x',
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      gasPrice: transferMessage.gasPrice,
      gasLimitExecution: transferMessage.gasLimitExecution,
      gasData: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      signature: '0xea229e2779a9838b660b3c45e12f96c07ea838de3ffef621f4b73ae29c9feda06adb51c4c130d063e2aa251759f442a27109e74faddd8665b73072edd4c924b41c'
    };

    const privateKey = '0x899d97b42f840d59d60f3a18514b28042a1d86fa400d6cf9425ec3a9217d0cea';

    const signedMessage = createSignedMessage({...transferMessage, from: '0x'}, privateKey);
    expect(signedMessage).to.deep.eq(expectedMessage);
  });
});

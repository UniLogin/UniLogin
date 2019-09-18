import {utils} from 'ethers';
import {expect} from 'chai';
import {SignedMessage, TEST_CONTRACT_ADDRESS, Message} from '@universal-login/commons';
import TEST_PAYMENT_OPTIONS from '../lib/defaultPaymentOptions';
import {messageToUnsignedMessage} from '../lib/message';

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

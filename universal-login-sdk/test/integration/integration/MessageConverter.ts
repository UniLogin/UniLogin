import {expect} from 'chai';
import {MessageConverter} from '../../../lib/core/services/MessageConverter';
import {utils} from 'ethers';
import {TEST_PRIVATE_KEY, TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, Message} from '@universal-login/commons';

describe('MessageConverter', () => {
  const messageConverter = new MessageConverter({} as any);

  it('Converts message to signed message', async () => {
    const message: Partial<Message> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasLimit: utils.bigNumberify(100000),
      nonce: 0,
    };
    const actualMessage = await messageConverter.messageToSignedMessage(message, TEST_PRIVATE_KEY);
    const expectedMessage = {
      gasBase: utils.bigNumberify(58976),
      gasCall: utils.bigNumberify(41024),
    };
    expect(actualMessage).to.deep.include(expectedMessage);
  });
});

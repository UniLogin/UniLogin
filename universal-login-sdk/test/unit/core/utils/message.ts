import {expect} from 'chai';
import {utils} from 'ethers';
import {Message, TEST_CONTRACT_ADDRESS, SignedMessage} from '@universal-login/commons';
import {SdkConfigDefault} from '../../../../lib/config/SdkConfigDefault';
import {messageToUnsignedMessage} from '../../../../lib/core/utils/message';

describe('UNIT: utils', () => {
  describe('messageToUnsignedMessage', () => {
    it('correct transform', async () => {
      const incomingMessage: Partial<Message> = {
        from: TEST_CONTRACT_ADDRESS,
        to: TEST_CONTRACT_ADDRESS,
        value: utils.parseEther('1'),
        gasPrice: SdkConfigDefault.paymentOptions.gasPrice,
        gasToken: SdkConfigDefault.paymentOptions.gasToken,
        data: '0xbeef',
        gasLimit: utils.bigNumberify(100000),
        nonce: 0
      };

      const expectedUnsignedMessage: Partial<SignedMessage> = {
        from: TEST_CONTRACT_ADDRESS,
        to: TEST_CONTRACT_ADDRESS,
        value: utils.parseEther('1'),
        gasPrice: SdkConfigDefault.paymentOptions.gasPrice,
        gasToken: SdkConfigDefault.paymentOptions.gasToken,
        data: '0xbeef',
        gasData: 8592,
        gasLimitExecution: utils.bigNumberify(100000 - 8592),
        nonce: 0,
      };

      const actualUnsginedMessage = messageToUnsignedMessage(incomingMessage);

      expect(actualUnsginedMessage).to.deep.equal(expectedUnsignedMessage);
    });
  });
});

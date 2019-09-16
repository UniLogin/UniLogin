import {expect} from 'chai';
import {utils} from 'ethers';
import {Message, TEST_CONTRACT_ADDRESS, SignedMessage, createFullHexString, createZeroedHexString, UnsignedMessage} from '@universal-login/commons';
import {SdkConfigDefault} from '../../../lib/config/SdkConfigDefault';
import {messageToUnsignedMessage, estimateGasDataFromSignedMessage, estimateGasDataFromUnsignedMessage} from '../../../lib/core/utils/utils';

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

  describe('estimateGasDataFromSignedMessage', () => {
    it('empty message costs 2192 gas', () => {
      const message: SignedMessage = {
        from: createZeroedHexString(20),
        nonce: 0,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192);
    });

    it(`from and nonce don't count for gasData`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192);
    });

    it(`add 0xff...ff 'to' address`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createFullHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 1280);
    });

    it(`add value 255 [0xff]`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 255,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 64);
    });

    it(`add gasPrice 255 [0xff]`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 255,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 64);
    });

    it(`add 0xff...ff gasToken address`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createFullHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 1280);
    });

    it(`add gasLimitExecution 1000`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 1000,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 128);
    });

    it(`add real gasData uint 0xff`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 255,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 64);
    });

    it(`add 100bytes of 0xff data`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createFullHexString(100),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createZeroedHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 6400 + 576);
    });

    it(`add signature`, () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0,
        signature: createFullHexString(65)
      };
      expect(estimateGasDataFromSignedMessage(message)).to.equal(2192 + 65 * 64);
    });
  });

  describe('``estimateGasDataFromUnsignedMessage', () => {
    it(`add signature`, () => {
      const message: UnsignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasLimitExecution: 0,
        gasData: 0
      };
      expect(estimateGasDataFromUnsignedMessage(message)).to.equal(2192 + 65 * 64);
    });
  });
});

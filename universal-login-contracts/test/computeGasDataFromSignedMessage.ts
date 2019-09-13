import {expect} from 'chai';
import {SignedMessage} from '@universal-login/commons';
import {estimateGasDataFromSignedMessage} from './helpers/estimateGasDataFromSignedMessage';

const createZeroedHexString = (bytesLength: number) => {
  return `0x${'00'.repeat(bytesLength)}`;
};

const createFullHexString = (bytesLength: number) => {
  return `0x${'ff'.repeat(bytesLength)}`;
};

describe('UNIT: computeGasDataFromSignedMessage', () => {
  const address = '0xbb174030E9A1FD5dD0950b6a284F19116cd7a672';
  const privateKey = '0x75d4b72127c96bb99aa49afdc023bd33677bbfd016ab9c59c938e3ad5d72636b';

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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
        from: address,
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
});

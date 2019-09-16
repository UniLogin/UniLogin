import {expect} from 'chai';
import {SignedMessage, createZeroedHexString, createFullHexString, UnsignedMessage} from '@universal-login/commons';
import {estimateGasDataFromSignedMessage, estimateGasDataFromUnsignedMessage, NOT_COMPUTED_FIELDS_GAS_FEE} from '../lib/estimateGas';

describe('UNIT: estimateGas', () => {
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 1280 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 64 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 64 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 1280 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.within(2192 + 128, 2192 + 128 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.within(2192 + 64, 2192 + 64 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 6400 + 576 + NOT_COMPUTED_FIELDS_GAS_FEE);
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
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2192 + 65 * 64 + NOT_COMPUTED_FIELDS_GAS_FEE);
    });
  });

  describe('estimateGasDataFromUnsignedMessage', () => {
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
      expect(estimateGasDataFromUnsignedMessage(message)).to.be.equal(2192 + 65 * 64 + NOT_COMPUTED_FIELDS_GAS_FEE);
    });
  });
});

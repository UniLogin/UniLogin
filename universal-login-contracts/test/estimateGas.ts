import {expect} from 'chai';
import {SignedMessage, createZeroedHexString, createFullHexString, UnsignedMessage, GAS_FIXED} from '@universal-login/commons';
import {estimateGasBaseFromSignedMessage, estimateGasBaseFromUnsignedMessage, calculateGasCall} from '../lib/estimateGas';
import {utils} from 'ethers';

describe('UNIT: estimateGas', () => {
  describe('estimateGasBaseFromSignedMessage', () => {
    it('empty message costs 2192 gas', () => {
      const message: SignedMessage = {
        from: createZeroedHexString(20),
        nonce: 0,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576).add(GAS_FIXED));
    });

    it('from and nonce don\'t count for gasBase', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576).add(GAS_FIXED));
    });

    it('add 0xff...ff \'to\' address', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createFullHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 1280).add(GAS_FIXED));
    });

    it('add value 255 [0xff]', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 255,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 64).add(GAS_FIXED));
    });

    it('add gasPrice 255 [0xff]', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 255,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 64).add(GAS_FIXED));
    });

    it('add 0xff...ff gasToken address', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createFullHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 1280).add(GAS_FIXED));
    });

    it('gasCall 1000 - but estimate don\'t chnage since gasCall already been accounted', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 1000,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576).add(GAS_FIXED));
    });

    it('gasBase 0xff - but estimate don\'t chnage since gasBase already been accounted', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 255,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576).add(GAS_FIXED));
    });

    it('add 100bytes of 0xff data', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createFullHexString(100),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 6400 + 576).add(GAS_FIXED));
    });

    it('add signature', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
        signature: createFullHexString(65),
      };
      expect(estimateGasBaseFromSignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 65 * 64).add(GAS_FIXED));
    });
  });

  describe('estimateGasBaseFromUnsignedMessage', () => {
    it('add signature', () => {
      const message: UnsignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasBase: 0,
      };
      expect(estimateGasBaseFromUnsignedMessage(message)).to.be.equal(utils.bigNumberify(2576 + 65 * 64).add(GAS_FIXED));
    });
  });

  describe('calculateGasCall', () => {
    it('gasBase is smaller than gasLimit', () => {
      const gasBase = '3000';
      const gasLimit = '10000';
      const expectedgasCall = '7000';
      expect(calculateGasCall(gasLimit, gasBase)).to.eq(expectedgasCall);
    });

    it('throw an error if gasBase is higher than gasLimit', () => {
      const gasBase = '10000';
      const gasLimit = '3000';
      expect(() => calculateGasCall(gasLimit, gasBase)).to.throw('Gas limit too low');
    });

    it('throw an error if gasBase and gasLimit are equal', () => {
      const gasBase = '10000';
      const gasLimit = '10000';
      expect(() => calculateGasCall(gasLimit, gasBase)).to.throw('Gas limit too low');
    });
  });
});

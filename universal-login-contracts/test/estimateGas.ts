import {expect} from 'chai';
import {SignedMessage, createZeroedHexString, createFullHexString, UnsignedMessage} from '@universal-login/commons';
import {estimateGasDataFromSignedMessage, estimateGasDataFromUnsignedMessage, calculategasCall} from '../lib/estimateGas';

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
        gasCall: 0,
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576);
    });

    it('from and nonce don\'t count for gasData', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 1280);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 64);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 64);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 1280);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576);
    });

    it('gasData 0xff - but estimate don\'t chnage since gasData already been accounted', () => {
      const message: SignedMessage = {
        from: createFullHexString(20),
        nonce: 1337,
        to: createZeroedHexString(20),
        value: 0,
        data: createZeroedHexString(0),
        gasPrice: 0,
        gasToken: createZeroedHexString(20),
        gasCall: 0,
        gasData: 255,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576);
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
        gasData: 0,
        signature: createZeroedHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 6400 + 576);
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
        gasData: 0,
        signature: createFullHexString(65),
      };
      expect(estimateGasDataFromSignedMessage(message)).to.be.equal(2576 + 65 * 64);
    });
  });

  describe('estimateGasDataFromUnsignedMessage', () => {
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
        gasData: 0,
      };
      expect(estimateGasDataFromUnsignedMessage(message)).to.be.equal(2576 + 65 * 64);
    });
  });

  describe('calculategasCall', () => {
    it('gasData is smaller than gasLimit', () => {
      const gasData = '3000';
      const gasLimit = '10000';
      const expectedgasCall = '7000';
      expect(calculategasCall(gasLimit, gasData)).to.eq(expectedgasCall);
    });

    it('throw an error if gasData is higher than gasLimit', () => {
      const gasData = '10000';
      const gasLimit = '3000';
      expect(() => calculategasCall(gasLimit, gasData)).to.throw('Gas limit too low');
    });

    it('throw an error if gasData and gasLimit are equal', () => {
      const gasData = '10000';
      const gasLimit = '10000';
      expect(() => calculategasCall(gasLimit, gasData)).to.throw('Gas limit too low');
    });
  });
});

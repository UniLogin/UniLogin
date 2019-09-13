import {expect} from 'chai';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, UnsignedMessage, createSignedMessage, SignedMessage} from '@universal-login/commons';
import KeyHolderContract from '../build/KeyHolder.json';
import {encodeFunction} from './helpers/argumentsEncoding';
import {computeGasDataFromSignedMessage, estimateGasDataFromSignedMessage} from './helpers/computeGasDataFromSignedMessage';

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

  xit('addKey meta transaction', async () => {
    const addKeyTransactionEncoding = encodeFunction(KeyHolderContract, 'addKey', [address]);
    const unsignedMessageBeforeGasDataComputation: UnsignedMessage = {
      from: address,
      nonce: 42,
      to: address,
      value: 1337,
      data: addKeyTransactionEncoding,
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      gasLimitExecution: DEFAULT_GAS_LIMIT,
      gasData: 4294967295, // 0x FF FF FF FF
    };
    const expectedUnsignedMessageAfterGasDataComputation: UnsignedMessage = {
      to: address,
      from: address,
      value: 1337,
      nonce: 42,
      data: addKeyTransactionEncoding,
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      gasLimitExecution: DEFAULT_GAS_LIMIT,
      gasData: 11536, // 0x 00 00 FF FF  => note that relayer will charge 2*(68-4) more gas than actual data cost
    };

    const signedMessage = await createSignedMessage(unsignedMessageBeforeGasDataComputation, privateKey);
    const actualUnsignedMessageAfterGasDataComputation = computeGasDataFromSignedMessage(signedMessage);

    expect(actualUnsignedMessageAfterGasDataComputation).to.deep.equal(expectedUnsignedMessageAfterGasDataComputation)
  });
});

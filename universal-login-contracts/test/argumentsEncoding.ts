import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from 'ethereum-waffle';
import {utils, Wallet} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {concatenateSignatures, TEST_ACCOUNT_ADDRESS, UnsignedMessage, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT_EXECUTION, calculateMessageSignature, OperationType} from '@universal-login/commons';
import {getExecutionArgs} from './helpers/argumentsEncoding';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('UNIT: argumentsEncoding', async () => {
  describe('concatenateSignatures', () => {
    let signature1: string;
    let signature2: string;
    const wallet1 = Wallet.createRandom();
    const wallet2 = Wallet.createRandom();
    const message = {
      from: wallet1.address,
      to: wallet1.address,
      value: utils.parseEther('0.1'),
      data: utils.hexlify(0),
      nonce: 0,
      gasToken: ETHER_NATIVE_TOKEN.address,
      gasPrice: DEFAULT_GAS_PRICE,
      gasCall: DEFAULT_GAS_LIMIT_EXECUTION,
      gasBase: '100000',
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };

    before(async () => {
      signature1 = await calculateMessageSignature(wallet1.privateKey, message);
      signature2 = await calculateMessageSignature(wallet2.privateKey, message);
    });

    it('Should concatenate two signatures arrays', async () => {
      const expected = `${signature1}${signature2.replace('0x', '')}`;
      const concatenate = concatenateSignatures([signature1, signature2]);
      expect(concatenate).to.be.equal(expected);
    });

    it('Should not concatenate two signatures arrays without 0x prefix', async () => {
      signature1 = `${signature1.replace('0x', '')}aa`;
      signature2 = `${signature2.replace('0x', '')}aa`;
      expect(concatenateSignatures.bind(null, [signature1, signature2])).to.throw(`Invalid Signature: ${signature1} needs prefix 0x`);
    });

    it('Should not concatenate two signatures arrays with invalid length', async () => {
      const sig1 = '0xffff';
      const sig2 = '0xffe2';
      expect(concatenateSignatures.bind(null, [sig1, sig2])).to.throw(`Invalid signature length: ${sig1} should be 132`);
    });
  });

  describe('getExecutionArgs', () => {
    it('should return corect array', async () => {
      const msg: UnsignedMessage = {
        from: TEST_ACCOUNT_ADDRESS,
        to: TEST_ACCOUNT_ADDRESS,
        value: utils.parseEther('1.0'),
        data: '0x0',
        nonce: 0,
        gasPrice: 0,
        gasCall: 0,
        gasToken: '0x0000000000000000000000000000000000000000',
        gasBase: 68,
        operationType: OperationType.call,
        refundReceiver: AddressZero,
      };

      const expectedResult = [
        TEST_ACCOUNT_ADDRESS,
        utils.parseEther('1.0'),
        '0x0',
        0,
        '0x0000000000000000000000000000000000000000',
        0,
        68,
      ];
      expect(getExecutionArgs(msg)).to.deep.eq(expectedResult);
    });
  });
});

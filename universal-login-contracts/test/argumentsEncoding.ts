import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from 'ethereum-waffle';
import {messageSignature, getExecutionArgs} from './helpers/argumentsEncoding';
import {utils, Wallet} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../lib/defaultPaymentOptions';
import {concatenateSignatures, TEST_ACCOUNT_ADDRESS, UnsignedMessage, computeGasData} from '@universal-login/commons';

chai.use(chaiAsPromised);
chai.use(solidity);

const {gasToken, gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('UNIT: argumentsEncoding', async () => {
  const wallet1 = Wallet.createRandom();
  const wallet2 = Wallet.createRandom();
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  const nonce = 0;

  describe('signature utils', () => {
    let signature1: string;
    let signature2: string;

    before(async () => {
      signature1 = await messageSignature(wallet1, wallet1.address, wallet1.address, value, data, nonce, gasToken, gasPrice, gasLimit, computeGasData(data));
      signature2 = await messageSignature(wallet1, wallet1.address, wallet2.address, value, data, nonce, gasToken, gasPrice, gasLimit, computeGasData(data));
    });

    it('Should return correct message signature', async () => {
      const from = wallet1.address;
      const message = utils.arrayify(utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint', 'uint'],
        [wallet1.address, from, value, data, nonce, gasToken, gasPrice, gasLimit, computeGasData(data)]));
      expect(utils.verifyMessage(message, signature1)).to.eq(wallet1.address);
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
        gasLimitExecution: 0,
        gasToken: '0x0000000000000000000000000000000000000000',
        gasData: 68
      };

      const expectedResult = [
        TEST_ACCOUNT_ADDRESS,
        utils.parseEther('1.0'),
        '0x0',
        0,
        '0x0000000000000000000000000000000000000000',
        0,
        68
      ];
      expect(getExecutionArgs(msg)).to.deep.eq(expectedResult);
    });
  });
});

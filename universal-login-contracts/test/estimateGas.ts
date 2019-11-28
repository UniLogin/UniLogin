import {expect} from 'chai';
import {createZeroedHexString, createFullHexString, GAS_FIXED, TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, computeGasData, Message} from '@universal-login/commons';
import {calculateGasCall, calculateGasBase} from '../lib/estimateGas';
import {utils} from 'ethers';
import {encodeDataForExecuteSigned} from '../lib';

describe('UNIT: estimateGas', () => {
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

  describe('calculateGasBase', () => {
    const itCalculatesBase = (messageType: string, message: Omit<Message, 'gasLimit'>) =>
      it(`calculates gas base as expected for ${messageType}`, () => {
        const encodedMessage = encodeDataForExecuteSigned({...message, gasCall: createFullHexString(3), gasBase: createFullHexString(3), signature: createFullHexString(65)});
        const gasData = utils.bigNumberify(computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculateGasBase(message)).to.eq(expectedResult);
      });

    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      from: TEST_ACCOUNT_ADDRESS,
      nonce: '1',
      data: '0x0',
      value: '1',
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
    };

    const emptyMessage = {
      from: createZeroedHexString(20),
      nonce: 0,
      to: createZeroedHexString(20),
      value: 0,
      data: createZeroedHexString(0),
      gasPrice: 0,
      gasToken: createZeroedHexString(20),
    };

    itCalculatesBase('transfer message', transferMessage);
    itCalculatesBase('empty message', emptyMessage);
  });
});

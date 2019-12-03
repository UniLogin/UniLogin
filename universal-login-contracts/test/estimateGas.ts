import {expect} from 'chai';
import {createFullHexString, GAS_FIXED, TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, GasComputation} from '@universal-login/commons';
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
    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      from: TEST_ACCOUNT_ADDRESS,
      nonce: '1',
      data: '0x0',
      value: '1',
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
    };
    const encodedMessage = encodeDataForExecuteSigned({...transferMessage, gasCall: createFullHexString(3), gasBase: createFullHexString(3), signature: createFullHexString(65)});

    describe('constantinople', () => {
      const gasComputation = new GasComputation('constantinople');

      it(`beta1 version and constantinople network`, () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculateGasBase(transferMessage, 'constantinople', 'beta1')).to.eq(expectedResult);
      });

      it(`beta2 version and constantinople network`, () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculateGasBase(transferMessage, 'constantinople', 'beta2')).to.eq(expectedResult);
      });
    });
    describe('istanbul', () => {
      const gasComputation = new GasComputation('istanbul');

      it(`beta1 version and constantinople network`, () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculateGasBase(transferMessage, 'istanbul', 'beta1')).to.eq(expectedResult);
      });

      it(`beta2 version and constantinople network`, () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculateGasBase(transferMessage, 'istanbul', 'beta2')).to.eq(expectedResult);
      });
    })
  });
});

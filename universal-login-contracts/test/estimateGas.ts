import {expect} from 'chai';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {createFullHexString, GAS_FIXED, TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, GasComputation, OperationType} from '@universal-login/commons';
import {calculateGasCall, calculatebaseGas} from '../lib/estimateGas';
import {encodeDataForExecuteSigned} from '../lib';

describe('UNIT: estimateGas', () => {
  describe('calculateGasCall', () => {
    it('baseGas is smaller than gasLimit', () => {
      const baseGas = '3000';
      const gasLimit = '10000';
      const expectedgasCall = '7000';
      expect(calculateGasCall(gasLimit, baseGas)).to.eq(expectedgasCall);
    });

    it('throw an error if baseGas is higher than gasLimit', () => {
      const baseGas = '10000';
      const gasLimit = '3000';
      expect(() => calculateGasCall(gasLimit, baseGas)).to.throw('Gas limit too low');
    });

    it('throw an error if baseGas and gasLimit are equal', () => {
      const baseGas = '10000';
      const gasLimit = '10000';
      expect(() => calculateGasCall(gasLimit, baseGas)).to.throw('Gas limit too low');
    });
  });

  describe('calculatebaseGas', () => {
    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      from: TEST_ACCOUNT_ADDRESS,
      nonce: '1',
      data: '0x0',
      value: '1',
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
    };
    const encodedMessage = encodeDataForExecuteSigned({...transferMessage, gasCall: createFullHexString(3), baseGas: createFullHexString(3), signature: createFullHexString(65)});

    describe('constantinople', () => {
      const gasComputation = new GasComputation('constantinople');

      it('beta1 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculatebaseGas(transferMessage, 'constantinople', 'beta1')).to.eq(expectedResult);
      });

      it('beta2 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculatebaseGas(transferMessage, 'constantinople', 'beta2')).to.eq(expectedResult);
      });
    });

    describe('istanbul', () => {
      const gasComputation = new GasComputation('istanbul');

      it('beta1 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculatebaseGas(transferMessage, 'istanbul', 'beta1')).to.eq(expectedResult);
      });

      it('beta2 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculatebaseGas(transferMessage, 'istanbul', 'beta2')).to.eq(expectedResult);
      });
    });
  });
});

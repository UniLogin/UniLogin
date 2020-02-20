import {expect} from 'chai';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {createFullHexString, GAS_FIXED, TEST_ACCOUNT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, GasDataComputation, OperationType, CONSTANT_EXECUTION_COSTS, SIGNATURE_CHECK_COST, ZERO_NONCE_COST} from '@unilogin/commons';
import {calculateSafeTxGas, calculateBaseGas} from '../src/estimateGas';
import {encodeDataForExecuteSigned} from '../src';

describe('UNIT: estimateGas', () => {
  describe('calculateSafeTxGas', () => {
    it('baseGas is smaller than gasLimit', () => {
      const baseGas = '3000';
      const gasLimit = '10000';
      const expectedsafeTxGas = '7000';
      expect(calculateSafeTxGas(gasLimit, baseGas)).to.eq(expectedsafeTxGas);
    });

    it('throw an error if baseGas is higher than gasLimit', () => {
      const baseGas = '10000';
      const gasLimit = '3000';
      expect(() => calculateSafeTxGas(gasLimit, baseGas)).to.throw('Gas limit too low');
    });

    it('throw an error if baseGas and gasLimit are equal', () => {
      const baseGas = '10000';
      const gasLimit = '10000';
      expect(() => calculateSafeTxGas(gasLimit, baseGas)).to.throw('Gas limit too low');
    });
  });

  describe('calculateBaseGas', () => {
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
    const encodedMessage = encodeDataForExecuteSigned({...transferMessage, safeTxGas: createFullHexString(3), baseGas: createFullHexString(3), signature: createFullHexString(65)});

    describe('constantinople', () => {
      const gasComputation = new GasDataComputation('constantinople');

      it('beta1 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculateBaseGas(transferMessage, 'constantinople', 'beta1')).to.eq(expectedResult);
      });

      it('beta2 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculateBaseGas(transferMessage, 'constantinople', 'beta2')).to.eq(expectedResult);
      });
    });

    describe('istanbul', () => {
      const gasComputation = new GasDataComputation('istanbul');

      it('beta1 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData;
        expect(calculateBaseGas(transferMessage, 'istanbul', 'beta1')).to.eq(expectedResult);
      });

      it('beta2 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage));
        const expectedResult = gasData.add(GAS_FIXED);
        expect(calculateBaseGas(transferMessage, 'istanbul', 'beta2')).to.eq(expectedResult);
      });

      it('beta3 version and constantinople network', () => {
        const gasData = utils.bigNumberify(gasComputation.computeGasData(encodedMessage)); // TODO: encodedMessage should be beta3
        const expectedResult = gasData.add(ZERO_NONCE_COST).add(SIGNATURE_CHECK_COST).add(CONSTANT_EXECUTION_COSTS);
        expect(calculateBaseGas(transferMessage, 'istanbul', 'beta3')).to.eq(expectedResult);
      });
    });
  });
});

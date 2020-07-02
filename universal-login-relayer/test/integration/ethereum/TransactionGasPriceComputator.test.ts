import {expect} from 'chai';
import {TEST_GAS_PRICE} from '@unilogin/commons';
import {TransactionGasPriceComputator} from '../../../src/integration/ethereum/TransactionGasPriceComputator';
import {utils} from 'ethers';
import {describe} from 'mocha';

describe('UNIT: TransactionGasPriceComputator', () => {
  const gasPriceOracle = {
    getGasPrices: () => ({
      fast: {gasPrice: TEST_GAS_PRICE},
    }),
  };
  const transactionGasPriceComputator = new TransactionGasPriceComputator(gasPriceOracle as any);

  describe('getGasPrice', () => {
    it('returns gasPrice if message`s gasPrice is more than 0', async () => {
      expect(await transactionGasPriceComputator.getGasPrice('20')).to.eq(utils.bigNumberify('20'));
    });

    it('returns current gasPrice if message`s gasPrice is eq 0', async () => {
      expect(await transactionGasPriceComputator.getGasPrice('0')).to.eq(utils.bigNumberify(TEST_GAS_PRICE));
    });
  });

  describe('getGasPriceInEth', () => {
    const transactionGasPriceComputator = new TransactionGasPriceComputator(gasPriceOracle as any);

    describe('gasPrice more than 0', () => {
      it('returns gasPriceInEth if given gasPrice is 20000000', async () => {
        expect(await transactionGasPriceComputator.getGasPriceInEth('20000000', 0.0000147)).to.eq(utils.bigNumberify('294'));
      });

      it('returns floored gasPriceInEth if given 2000000', async () => {
        expect(await transactionGasPriceComputator.getGasPriceInEth('2000000', 0.0000147)).to.eq(utils.bigNumberify('29'));
      });
    });

    describe('gasPrice equals 0', () => {
      it('gasPriceInEth with rate eq 1', async () => {
        expect(await transactionGasPriceComputator.getGasPriceInEth('0', 1)).to.eq(utils.bigNumberify(TEST_GAS_PRICE));
      });

      it('gasPriceInEth with rate eq 0.5', async () => {
        expect(await transactionGasPriceComputator.getGasPriceInEth('0', 0.5)).to.eq(utils.bigNumberify(TEST_GAS_PRICE).div(2));
      });
    });
  });
});

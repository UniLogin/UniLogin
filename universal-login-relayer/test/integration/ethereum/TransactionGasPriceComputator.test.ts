import {expect} from 'chai';
import {TEST_GAS_PRICE} from '@unilogin/commons';
import {TransactionGasPriceComputator} from '../../../src/integration/ethereum/TransactionGasPriceComputator';
import {utils} from 'ethers';

describe('UNIT: TransactionGasPriceComputator', () => {
  const gasPriceOracle = {
    getGasPrices: () => ({
      fast: {gasPrice: TEST_GAS_PRICE},
    }),
  };

  const transactionGasPriceComputator = new TransactionGasPriceComputator(gasPriceOracle as any);

  it('returns gasPrice if message`s gasPrice is more than 0', async () => {
    expect(await transactionGasPriceComputator.getGasPrice('20')).to.eq(utils.bigNumberify('20'));
  });

  it('returns current gasPrice if message`s gasPrice is eq 0', async () => {
    expect(await transactionGasPriceComputator.getGasPrice('0')).to.eq(utils.bigNumberify(TEST_GAS_PRICE));
  });
});

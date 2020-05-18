import {TEST_GAS_PRICE, GasPriceOracle} from '@unilogin/commons';

export const gasPriceOracleMock = {
  getGasPrices: () => ({
    fast: {gasPrice: TEST_GAS_PRICE},
  }),
} as unknown as GasPriceOracle;

import {GasPriceOracle, TEST_GAS_PRICES} from '../../../src';

export const gasPriceOracleMock = {
  getGasPrices: () => Promise.resolve(TEST_GAS_PRICES),
} as unknown as GasPriceOracle;

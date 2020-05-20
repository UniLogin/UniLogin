import {GasPriceOracle, TEST_GAS_PRICES} from '../../../src';

export const mockGasPriceOracle = (gasPriceOracle: GasPriceOracle) => {
  gasPriceOracle.getGasPrices = () => Promise.resolve(TEST_GAS_PRICES);
  return gasPriceOracle;
};

export const getMockedGasPriceOracle = () => {
  const oracle = new GasPriceOracle();
  return mockGasPriceOracle(oracle);
};

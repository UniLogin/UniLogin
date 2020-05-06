import {PriceObserver} from '../../src/core/observers/PriceObserver';
import {TokensDetailsStore} from '../../src/core/services/TokensDetailsStore';
import {TokenPricesService} from '@unilogin/commons';

export const PRICES_BEFORE = {
  ETH: {USD: 218.21, DAI: 194.38, SAI: 194.38, ETH: 0.01893},
  Mock: {USD: 0.02619, DAI: 0.02337, SAI: 0.02337, ETH: 0.00000227},
};

export const PRICES_AFTER = {
  ETH: {USD: 1838.51, DAI: 1494.71, SAI: 1494.71, ETH: 0.09893},
  Mock: {USD: 0.2391, DAI: 0.1942, SAI: 0.1942, ETH: 0.00001427},
};

export const PRICES = [
  PRICES_BEFORE,
  PRICES_AFTER,
];

export const createMockedPriceObserver = () => {
  let callCount = 0;
  const resetCallCount = () => {
    callCount = 0;
  };
  const mockedPriceObserver = new PriceObserver({} as TokensDetailsStore, {} as TokenPricesService, 150);

  mockedPriceObserver.getCurrentPrices = async () => {
    return callCount < PRICES.length ? PRICES[callCount++] : {};
  };

  return {mockedPriceObserver, resetCallCount};
};

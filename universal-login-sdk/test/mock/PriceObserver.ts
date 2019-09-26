import {PriceObserver} from '../../lib/core/observers/PriceObserver';
import {TokensDetailsStore} from '../../lib/core/services/TokensDetailsStore';

export const PRICES_BEFORE = {
  ETH: { USD: 218.21, DAI: 194.38, ETH: 0.01893 },
  Mock: { USD: 0.02619, DAI: 0.02337, ETH: 0.00000227 }
};

export const PRICES_AFTER = {
  ETH: { USD: 1838.51, DAI: 1494.71, ETH: 0.09893 },
  Mock: { USD: 0.2391, DAI: 0.1942, ETH: 0.00001427 }
};

export const PRICES = [
  PRICES_BEFORE,
  PRICES_AFTER
];

export const createMockedPriceObserver = () => {
  let callCount = 0;
  const resetCallCount = () => {
    callCount = 0;
  };
  const mockedPriceObserver = new PriceObserver({} as TokensDetailsStore, ['USD', 'DAI', 'ETH']);

  mockedPriceObserver.getCurrentPrices = async () => {
    return callCount < PRICES.length ? PRICES[callCount++] : {};
  };

  return {mockedPriceObserver, resetCallCount};
};

import {PriceObserver} from '../../lib/core/observers/PriceObserver';
import {SdkConfigDefault} from '../../lib/config/SdkConfigDefault';

export const PRICES_BEFORE = {
  ETH: { USD: 218.21, EUR: 194.38, BTC: 0.01893 },
  Mock: { USD: 0.02619, EUR: 0.02337, BTC: 0.00000227 }
};

export const PRICES_AFTER = {
  ETH: { USD: 1838.51, EUR: 1494.71, BTC: 0.09893 },
  Mock: { USD: 0.2391, EUR: 0.1942, BTC: 0.00001427 }
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

  const mockedPriceObserver = new PriceObserver(SdkConfigDefault.observedTokens, ['USD', 'EUR', 'BTC']);

  mockedPriceObserver.getCurrentPrices = async () => {
    return callCount < PRICES.length ? PRICES[callCount++] : {};
  };

  return {mockedPriceObserver, resetCallCount};
};

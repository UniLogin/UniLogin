import {ObservedCurrency, PriceObserver} from '../../lib/core/observers/PriceObserver';
import {TokenDetails, ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS} from '@universal-login/commons';

export const OBSERVED_CURRENCIES: ObservedCurrency[] = ['USD', 'EUR', 'BTC'];

export const PRICES_BEFORE = {
  ETH: { USD: 218.21, EUR: 194.38, BTC: 0.01893 },
  Mock: { USD: 0.02619, EUR: 0.02337, BTC: 0.00000227 }
};

export const PRICES_AFTER = {
  ETH: { USD: 1838.51, EUR: 1494.71, BTC: 0.09893 },
  Mock: { USD: 0.2391, EUR: 0.1942, BTC: 0.00001427 }
};

export const createMockedPriceObserver = (observedTokens: TokenDetails[]) => {
  let callCount = 0;
  const resetCallCount = () => {
    callCount = 0;
  };

  const mockedPriceObserver = new PriceObserver(observedTokens, OBSERVED_CURRENCIES, 100);
  mockedPriceObserver.getCurrentPrices = async () => {
    callCount++;
    if (callCount === 1) {
      return PRICES_BEFORE;
    } else if (callCount === 2) {
      return PRICES_AFTER;
    }
    return {};
  };

  return {mockedPriceObserver, resetCallCount};
};

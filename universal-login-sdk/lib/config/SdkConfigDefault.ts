import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {SdkConfig} from './SdkConfig';

export const SdkConfigDefault: SdkConfig = {
  applicationInfo: {
    applicationName: 'Unknown application',
    logo: 'none',
    type: 'unknown',
  },
  observedTokensAddresses: [
    ETHER_NATIVE_TOKEN.address,
  ],
  observedCurrencies: [
    'USD',
    'DAI',
    'SAI',
    'ETH',
  ],
  executionFactoryTick: 1000,
  notice: '',
  authorizationsObserverTick: 1000,
  balanceObserverTick: 1000 * 3,
  priceObserverTick: 1000 * 60 * 5,
};

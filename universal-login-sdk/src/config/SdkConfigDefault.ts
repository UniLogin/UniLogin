import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {SdkConfig} from './SdkConfig';
import {MemoryStorageService} from '../core/services/MemoryStorageService';

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
  notice: '',
  authorizationsObserverTick: 1000,
  balanceObserverTick: 1000 * 3,
  priceObserverTick: 1000 * 60 * 5,
  mineableFactoryTick: 1000,
  mineableFactoryTimeout: 600000,
  storageService: new MemoryStorageService(),
};

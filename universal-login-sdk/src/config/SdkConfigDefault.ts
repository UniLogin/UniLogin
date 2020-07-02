import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {SdkConfig} from './SdkConfig';
import {MemoryStorageService} from '../core/services/MemoryStorageService';

export const SdkConfigDefault: SdkConfig = {
  network: 'mainnet',
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
  erc721TokensObserverTick: 1000 * 8,
  priceObserverTick: 1000 * 60 * 5,
  mineableFactoryTick: 500,
  mineableFactoryTimeout: 600000,
  storageService: new MemoryStorageService(),
  notifySdkApiKey: '9d968152-8306-4ea7-be11-57819274882e',
};

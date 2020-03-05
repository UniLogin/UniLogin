import {ObservedCurrency, ApplicationInfo, Network} from '@unilogin/commons';
import {IStorageService} from '../core/models/IStorageService';

export interface SdkConfig {
  network: Network;
  applicationInfo: ApplicationInfo;
  observedTokensAddresses: string[];
  saiTokenAddress?: string;
  observedCurrencies: ObservedCurrency[];
  notice: string;
  authorizationsObserverTick: number;
  balanceObserverTick: number;
  priceObserverTick: number;
  mineableFactoryTick: number;
  mineableFactoryTimeout: number;
  storageService: IStorageService;
  notifySdkApiKey: string;
}

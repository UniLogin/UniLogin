import {ObservedCurrency, ApplicationInfo, Network, asNetwork, asApplicationInfo, Omit} from '@unilogin/commons';
import {IStorageService} from '../core/models/IStorageService';
import {asArray, asString, asNumber, asPartialObject} from '@restless/sanitizers';

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
  rampApiKey?: string;
  apiKey?: string;
}

type SdkOverrides = Omit<SdkConfig, 'observedCurrencies' | 'storageService'>;

export const asSdkConfigOverrides = asPartialObject<SdkOverrides>({
  network: asNetwork,
  applicationInfo: asApplicationInfo,
  observedTokensAddresses: asArray(asString),
  saiTokenAddress: asString,
  notice: asString,
  authorizationsObserverTick: asNumber,
  balanceObserverTick: asNumber,
  priceObserverTick: asNumber,
  mineableFactoryTick: asNumber,
  mineableFactoryTimeout: asNumber,
  notifySdkApiKey: asString,
  rampApiKey: asString,
  apiKey: asString,
});

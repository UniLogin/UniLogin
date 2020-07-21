import {ObservedCurrency, ApplicationInfo, Network, asNetwork, asApplicationInfo, Omit, RampOverrides, asRampOverrides} from '@unilogin/commons';
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
  erc721TokensObserverTick: number;
  priceObserverTick: number;
  mineableFactoryTick: number;
  mineableFactoryTimeout: number;
  storageService: IStorageService;
  notifySdkApiKey: string;
  rampOverrides?: RampOverrides;
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
  erc721TokensObserverTick: asNumber,
  priceObserverTick: asNumber,
  mineableFactoryTick: asNumber,
  mineableFactoryTimeout: asNumber,
  notifySdkApiKey: asString,
  rampOverrides: asRampOverrides,
  apiKey: asString,
});

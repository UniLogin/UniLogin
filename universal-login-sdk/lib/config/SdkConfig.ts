import {ObservedCurrency, ApplicationInfo} from '@universal-login/commons';

export interface SdkConfig {
  applicationInfo: ApplicationInfo;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
  executionFactoryTick: number;
  notice: string;
  authorizationsObserverTick: number;
  balanceObserverTick: number;
  priceObserverTick: number;
}

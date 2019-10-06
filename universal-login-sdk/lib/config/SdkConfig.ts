import {ObservedCurrency, PaymentOptions, ApplicationInfo} from '@universal-login/commons';

export interface SdkConfig {
  applicationInfo: ApplicationInfo;
  paymentOptions: PaymentOptions;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
  executionFactoryTick: number;
  notice: string;
  authorizationsObserverTick: number;
  balanceObserverTick: number;
  priceObserverTick: number;
}

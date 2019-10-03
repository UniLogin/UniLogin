import {ObservedCurrency, PaymentOptions} from '@universal-login/commons';

export interface SdkConfig {
  applicationName: string;
  paymentOptions: PaymentOptions;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
  executionFactoryTick: number;
  authorizationsObserverTick: number;
  balanceObserverTick: number;
  priceObserverTick: number;
}

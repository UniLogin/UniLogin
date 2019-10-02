import {ObservedCurrency, PaymentOptions} from '@universal-login/commons';

export interface SdkConfig {
  applicationName: string;
  paymentOptions: PaymentOptions;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
  authorisationsObserverTick: number;
  executionFactoryTick: number;
  notice: string;
}

import {ObservedCurrency, PaymentOptions} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: PaymentOptions;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
}

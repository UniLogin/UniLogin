import {ObservedToken, ObservedCurrency, PaymentOptions} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: PaymentOptions;
  observedTokens: ObservedToken[];
  observedCurrencies: ObservedCurrency[];
}

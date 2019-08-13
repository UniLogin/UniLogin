import {TokenDetails, ObservedCurrency, PaymentOptions} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: PaymentOptions;
  observedTokens: TokenDetails[];
  observedCurrencies: ObservedCurrency[];
}

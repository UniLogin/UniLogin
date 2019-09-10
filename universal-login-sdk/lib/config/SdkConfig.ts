import {ObservedCurrency, PaymentOptions, Omit} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: Omit<PaymentOptions, 'gasData'>;
  observedTokensAddresses: string[];
  observedCurrencies: ObservedCurrency[];
  authorisationsObserverTick: number;
  executionFactoryTick: number;
}

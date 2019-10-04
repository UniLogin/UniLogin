import {ObservedCurrency, PaymentOptions} from '@universal-login/commons';
import {ApplicationInfo} from '@universal-login/commons/lib';

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

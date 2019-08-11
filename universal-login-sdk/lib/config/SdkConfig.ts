import {Message, TokenDetails} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: Message;
  observedTokens: TokenDetails[];
  observedCurrencies: Array<'USD' | 'EUR' | 'BTC'>;
}

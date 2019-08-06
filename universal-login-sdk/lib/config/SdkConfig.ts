import {Message, ObservedToken} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: Message;
  observedTokens: ObservedToken[];
}

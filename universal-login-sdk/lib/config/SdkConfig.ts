import {PartialRequired, SignedMessage, ObservedToken} from '@universal-login/commons';

export interface SdkConfig {
  paymentOptions: PartialRequired<SignedMessage, 'gasPrice' | 'gasLimit' | 'operationType' | 'value' | 'data'>;
  observedTokens: ObservedToken[];
}

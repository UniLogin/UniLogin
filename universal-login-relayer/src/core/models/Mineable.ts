import {MessageState} from '@unilogin/commons';

export interface Mineable {
  transactionHash: string | null;
  error: string | null;
  state: MessageState;
  gasPriceUsed: string | null;
  gasUsed: string | null;
}

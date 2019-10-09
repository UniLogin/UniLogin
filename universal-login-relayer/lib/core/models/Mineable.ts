import {MessageState} from '@universal-login/commons';

export interface Mineable {
  transactionHash: string | null;
  error: string | null;
  state: MessageState;
}

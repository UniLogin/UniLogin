import {MessageState} from '@universal-login/commons';

export interface RepositoryItem {
  transactionHash: string | null;
  error: string | null;
  state: MessageState;
}

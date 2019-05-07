import {utils} from 'ethers';

export interface ITransactionQueueStore {
  add: (transaction: Partial<utils.Transaction>) => Promise<string>;
  getNext: () => Promise<TransactionEntity | undefined>;
  onSuccessRemove: (id: string, hash: string) => Promise<void>;
  onErrorRemove: (id: string, error: string) => Promise<void>;
}

export interface TransactionEntity {
  id: string;
  hash: string | undefined;
  error: string | undefined;
  message: Partial<utils.Transaction>;
}

export default ITransactionQueueStore;
import {utils} from 'ethers';
import {ITransactionQueueStore, TransactionEntity} from './ITransactionQueueStore';

export default class TransactionQueueMemoryStore implements ITransactionQueueStore {
  private counter: number;
  public transactionEntries: TransactionEntity[];

  constructor() {
    this.counter = 0;
    this.transactionEntries = [];
  }

  async add (transaction: Partial<utils.Transaction>) {
    this.counter++;
    this.transactionEntries.push({
      message: transaction,
      id: this.counter.toString(),
      hash: 'hash',
      error: undefined
    });
    return this.counter.toString();
  }

  async getNext () {
    return this.transactionEntries[0];
  }

  async onSuccessRemove (id: string, hash: string) {
    this.transactionEntries.pop();
  }

  async onErrorRemove (id: string, error: string) {
    this.transactionEntries.pop();
  }
}
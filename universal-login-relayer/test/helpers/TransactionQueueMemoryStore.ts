import {utils} from 'ethers';
import {ITransactionQueueStore} from '@universal-login/commons';

export default class TransactionQueueMemoryStore implements ITransactionQueueStore {
  public database: Partial<utils.Transaction>[];
  constructor() {
    this.database = [];
  }

  async add (transaction: Partial<utils.Transaction>) {
    this.database.push(transaction);
    return '1';
  }

  async getNext () {
    const message = this.database[0];
    return message ? {message, id: '1', hash: 'hash', error: undefined} : undefined;
  }

  async onSuccessRemove (id: string, hash: string) {
    this.database.pop();
  }

  async onErrorRemove (id: string, error: string) {
    this.database.pop();
  }
}
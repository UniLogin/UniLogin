import {utils} from 'ethers';

export default class TransactionQueueMemoryStore {
  public database: Partial<utils.Transaction>[];
  constructor() {
    this.database = [];
  }
  add = async (transaction: Partial<utils.Transaction>) => this.database.push(transaction);
  getNext = async () => {const message = this.database[0]; return message ? {message, id: '1'} : undefined; };
  onSuccessRemove = async (id: string, hash: string) => this.database.pop();
  onErrorRemove = async (id: string, error: string) => this.database.pop();
}
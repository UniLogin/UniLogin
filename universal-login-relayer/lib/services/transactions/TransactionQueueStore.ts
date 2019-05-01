import Knex from 'knex';
import {utils} from 'ethers';
import {ITransactionQueueStore} from './ITransactionQueueStore';
import {stringifyTransactionFields, bignumberifyTransactionFields} from '../../utils/changingTransactionFields';

interface QueueItem {
  hash?: string;
  error?: string;
}

export default class TransactionQueueStore implements ITransactionQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'transactions';
  }

  async add(transaction: Partial<utils.Transaction>) {
    return this.database
      .insert({
        message: stringifyTransactionFields(transaction),
        created_at: this.database.fn.now()
      })
      .into(this.tableName)
      .returning('id');
  }

  async getNext() {
    const next = await this.database(this.tableName)
      .first()
      .where('hash', null)
      .andWhere('error', null)
      .orderBy('created_at', 'asc')
      .select();
    if (next) {
      next.message = bignumberifyTransactionFields(next.message);
    }
    return next;
  }

  async onSuccessRemove (id: string, hash: string) {
    await this.remove(id, {hash});
  }

  async onErrorRemove (id: string, error: string) {
    await this.remove(id, {error});
  }

  private remove(id: string, data: QueueItem) {
    return this.database(this.tableName)
      .where('id', id)
      .update(data);
  }
}
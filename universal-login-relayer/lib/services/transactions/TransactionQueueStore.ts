import Knex from 'knex';
import {SignedMessage} from '@universal-login/commons';
import {ITransactionQueueStore} from './ITransactionQueueStore';
import {stringifySignedMessageFields, bignumberifySignedMessageFields} from '../../utils/changingTransactionFields';

interface QueueItem {
  hash?: string;
  error?: string;
}

export default class TransactionQueueStore implements ITransactionQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'transactions';
  }

  async add(signedMessage: SignedMessage) {
    return this.database
      .insert({
        message: stringifySignedMessageFields(signedMessage),
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
      next.message = bignumberifySignedMessageFields(next.message);
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

import Knex from 'knex';
import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields} from '@universal-login/commons';
import {IMessageQueueStore} from './IMessageQueueStore';

interface QueueItem {
  hash?: string;
  error?: string;
}

export default class MessageQueueStore implements IMessageQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'transactions';
  }

  async add(signedMessage: SignedMessage) {
    const [id] = await this.database
      .insert({
        message: stringifySignedMessageFields(signedMessage),
        created_at: this.database.fn.now()
      })
      .into(this.tableName)
      .returning('id');
    return id;
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

  async markAsSuccess (messageId: string, transactionHash: string) {
    await this.update(messageId, {hash: transactionHash});
  }

  async markAsError (messageId: string, inputError: string) {
    let error: string = inputError;
    if (error.length > 255) {
      error = error.substr(0, 255);
    }
    await this.update(messageId, {error});
  }

  async get(id: string) {
    return this.database(this.tableName)
      .where('id', id)
      .select()
      .first();
  }

  private update(id: string, data: QueueItem) {
    return this.database(this.tableName)
      .where('id', id)
      .update(data);
  }
}

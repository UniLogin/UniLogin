import Knex from 'knex';
import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, calculateMessageHash} from '@universal-login/commons';
import {IMessageQueueStore} from './IMessageQueueStore';

interface QueueItem {
  transactionHash?: string;
  error?: string;
}

export default class MessageQueueStore implements IMessageQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'finalMessages';
  }

  async add(signedMessage: SignedMessage) {
    const messageHash = calculateMessageHash(signedMessage);
    await this.database
      .insert({
        messageHash,
        message: stringifySignedMessageFields(signedMessage),
        created_at: this.database.fn.now()
      })
      .into(this.tableName);
    return messageHash;
  }

  async getNext() {
    const next = await this.database(this.tableName)
      .first()
      .where('transactionHash', null)
      .andWhere('error', null)
      .orderBy('created_at', 'asc')
      .select();
    if (next) {
      next.message = bignumberifySignedMessageFields(next.message);
    }
    return next;
  }

  async markAsSuccess (messageHash: string, transactionHash: string) {
    await this.update(messageHash, {transactionHash});
  }

  async markAsError (messageHash: string, error: string) {
    await this.update(messageHash, {error});
  }

  async get(messageHash: string) {
    return this.database(this.tableName)
      .where('messageHash', messageHash)
      .select()
      .first();
  }

  async getStatus(messageHash: string) {
    return this.database(this.tableName)
      .first()
      .where('messageHash', messageHash)
      .select(['messageHash', 'transactionHash', 'error']);
  }

  private update(messageHash: string, data: QueueItem) {
    return this.database(this.tableName)
      .where('messageHash', messageHash)
      .update(data);
  }
}

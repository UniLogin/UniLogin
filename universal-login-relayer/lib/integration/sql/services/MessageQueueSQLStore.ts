import Knex from 'knex';
import {SignedMessage, stringifySignedMessageFields, bignumberifySignedMessageFields, calculateMessageHash} from '@universal-login/commons';
import {IMessageQueueStore} from '../../../core/services/messages/IMessageQueueStore';

interface QueueItem {
  transactionHash?: string;
  error?: string;
}

export default class MessageQueueStore implements IMessageQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'queue_items';
  }

  async add(signedMessage: SignedMessage) {
    const messageHash = calculateMessageHash(signedMessage);
    await this.database
      .insert({
        hash: messageHash,
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
      .column('message', {messageHash: 'hash'}, 'error', 'transactionHash')
      .select();
    if (next) {
      next.message = bignumberifySignedMessageFields(next.message);
    }
    return next;
  }

  async markAsSuccess (hash: string, transactionHash: string) {
    await this.update(hash, {transactionHash});
  }

  async markAsError (hash: string, error: string) {
    await this.update(hash, {error});
  }

  async get(hash: string) {
    return this.database(this.tableName)
      .where('hash', hash)
      .select()
      .first();
  }

  async getStatus(hash: string) {
    return this.database(this.tableName)
      .first()
      .where('hash', hash)
      .select(['hash', 'transactionHash', 'error']);
  }

  private async update(hash: string, data: QueueItem) {
    return this.database(this.tableName)
      .where('hash', hash)
      .update(data);
  }
}

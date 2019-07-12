import Knex from 'knex';
import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {IQueueStore} from '../../../core/services/messages/IQueueStore';

export default class QueueSQLStore implements IQueueStore {
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'queue_items';
  }

  async add(signedMessage: SignedMessage) {
    const messageHash = calculateMessageHash(signedMessage);
    await this.database
      .insert({
        hash: messageHash,
        type: 'Mesasge',
        created_at: this.database.fn.now()
      })
      .into(this.tableName);
    return messageHash;
  }

  async getNext() {
    const next = await this.database(this.tableName)
      .first()
      .orderBy('created_at', 'asc')
      .column('hash', 'type')
      .select();
    return next;
  }

  async remove(hash: string) {
    return this.database(this.tableName)
      .where('hash', hash)
      .delete();
  }
}

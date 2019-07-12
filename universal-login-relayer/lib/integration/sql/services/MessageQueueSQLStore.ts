import Knex from 'knex';
import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {IMessageQueueStore} from '../../../core/services/messages/IMessageQueueStore';

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
        created_at: this.database.fn.now()
      })
      .into(this.tableName);
    return messageHash;
  }

  async getNext() {
    const next = await this.database(this.tableName)
      .first()
      .orderBy('created_at', 'asc')
      .column('hash')
      .select();
    return next;
  }

  async remove(hash: string) {
    return this.database(this.tableName)
      .where('hash', hash)
      .delete();
  }
}

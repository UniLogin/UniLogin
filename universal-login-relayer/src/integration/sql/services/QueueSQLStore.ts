import Knex from 'knex';
import {IExecutionQueue} from '../../../core/models/execution/IExecutionQueue';
import Deployment from '../../../core/models/Deployment';

export default class QueueSQLStore implements IExecutionQueue {
  tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'queue_items';
  }

  async addMessage(messageHash: string) {
    await this.database
      .insert({
        hash: messageHash,
        type: 'Message',
        created_at: this.database.fn.now(),
      })
      .into(this.tableName);
    return messageHash;
  }

  async addDeployment(deployment: Deployment) {
    await this.database
      .insert({
        hash: deployment.hash,
        type: 'Deployment',
        created_at: this.database.fn.now(),
      })
      .into(this.tableName);
    return deployment.hash;
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
    await this.database(this.tableName)
      .where('hash', hash)
      .delete();
  }
}

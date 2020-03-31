import Knex from 'knex';
import {IExecutionQueue} from '../../../core/models/execution/IExecutionQueue';

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

  async addDeployment(deploymentHash: string) {
    await this.database
      .insert({
        hash: deploymentHash,
        type: 'Deployment',
        created_at: this.database.fn.now(),
      })
      .into(this.tableName);
    return deploymentHash;
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
      .del();
  }
}

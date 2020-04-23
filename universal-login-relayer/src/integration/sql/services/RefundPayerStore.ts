import Knex from 'knex';
import {RefundPayer} from '../../../core/models/RefundPayer';

export class RefundPayerStore {
  private tableName = 'refund_payers';

  constructor(private database: Knex) {}

  async add(refundPayer: RefundPayer) {
    return this.database<RefundPayer>(this.tableName)
      .insert(refundPayer, ['name', 'apiKey']);
  }

  get(apiKey: string) {
    return this.database<RefundPayer>(this.tableName)
      .where({apiKey})
      .select(['name', 'apiKey'])
      .first();
  }
}

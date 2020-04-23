import Knex from 'knex';
import {RefundPayer, RefundPayerEntity} from '../../../core/models/RefundPayer';

export class RefundPayerStore {
  private tableName = 'refund_payers';

  constructor(private database: Knex) {}

  async add(refundPayer: RefundPayer) {
    return this.database<RefundPayerEntity>(this.tableName)
      .insert(refundPayer, ['name', 'apiKey']);
  }

  async get(apiKey: string): Promise<RefundPayer | undefined> {
    return this.database<RefundPayerEntity>(this.tableName)
      .where({apiKey})
      .select(['name', 'apiKey'])
      .first();
  }
}

import Knex, {QueryBuilder} from 'knex';
import {RefundPayer} from '../../../core/models/RefundPayer';

export class RefundPayerStore {
  private table: QueryBuilder;

  constructor(database: Knex) {
    this.table = database<RefundPayer>('refund_payers');
  }

  async add(refundPayer: RefundPayer) {
    return this.table
      .insert(refundPayer, ['name', 'apiKey']);
  }

  get(apiKey: string) {
    return this.table
      .where({apiKey})
      .select()
      .first();
  }
}

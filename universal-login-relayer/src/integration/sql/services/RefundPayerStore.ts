import Knex, {QueryBuilder} from 'knex';
import {RefundPayer} from '../../../core/models/RefundPayer';

export class RefundPayerStore {
  private table: QueryBuilder;

  constructor(database: Knex) {
    this.table = database<RefundPayer>('refund_payers');
  }

  async add(refundPayer: RefundPayer) {
    const [id] = await this.table
      .returning('id')
      .insert(refundPayer);
    return id;
  }

  get(id: number) {
    return this.table
      .where({id})
      .select()
      .first();
  }
}

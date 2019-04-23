import Knex from 'knex';
import {utils} from 'ethers';
import {parseTransactionParametersToString, parseTransactionParametersToBigNumber} from '../utils/parseTransaction';

interface QueueData {
  hash?: string;
  error?: string;
}

export default class TransactionQueueStore{
  public tableName: string;

  constructor(public database: Knex) {
    this.tableName = 'transactions';
  }

  async add(transaction: Partial<utils.Transaction>) {
    return this.database.insert({message: parseTransactionParametersToString(transaction), created_at: this.database.fn.now()})
      .into(this.tableName)
      .returning('id');
  }

  async getNext() {
    const next = await this.database(this.tableName)
      .first()
      .where('hash', null)
      .andWhere('error', null)
      .orderBy('created_at', 'asc')
      .select();
    if (next) {
      next.message = parseTransactionParametersToBigNumber(next.message);
    }
    return next;
  }

  remove(id: string, data: QueueData) {
    return this.database(this.tableName)
      .where('id', id)
      .update(data);
  }
}
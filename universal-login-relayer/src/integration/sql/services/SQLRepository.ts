import Knex from 'knex';
import {NotFound} from '../../../core/utils/errors';
import IRepository from '../../../core/models/messages/IRepository';
import {MineableState} from '@unilogin/commons';
import {ensureProperTransactionHash} from '../../../core/utils/validations';
import {Mineable} from '../../../core/models/Mineable';

export class SQLRepository<T extends Mineable> implements IRepository<T> {
  constructor(public knex: Knex, protected tableName: string) {
  }

  async add(hash: string, item: T) {
    await this.knex
      .insert({
        hash,
        ...item,
      })
      .into(this.tableName);
  }

  async get(hash: string) {
    const item = await this.knex(this.tableName)
      .where('hash', hash)
      .first();

    if (!item) {
      throw new NotFound(hash, 'NotFound');
    }
    return item;
  }

  async isPresent(hash: string) {
    const item = await this.knex(this.tableName)
      .where('hash', hash)
      .first();

    return !!item;
  }

  async remove(hash: string) {
    const item = await this.get(hash);
    await this.knex(this.tableName)
      .where('hash', hash)
      .del();
    return item;
  }

  async setState(hash: string, state: MineableState) {
    await this.knex(this.tableName)
      .where('hash', hash)
      .update('state', state);
  }

  async markAsPending(hash: string, transactionHash: string, gasPriceUsed: string) {
    ensureProperTransactionHash(transactionHash);
    await this.knex<Mineable>(this.tableName)
      .where('hash', hash)
      .update({transactionHash, gasPriceUsed, state: 'Pending'});
  }

  async markAsSuccess(hash: string, gasUsed: string) {
    await this.knex<Mineable>(this.tableName)
      .where('hash', hash)
      .update({gasUsed, state: 'Success'});
  }

  async markAsError(hash: string, error: string) {
    await this.knex(this.tableName)
      .where('hash', hash)
      .update({error, state: 'Error'});
  }
}

export default SQLRepository;

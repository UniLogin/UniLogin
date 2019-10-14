import Knex from 'knex';
import {NotFound} from '../../../core/utils/errors';
import IRepository from '../../../core/services/messages/IRepository';
import {MineableState} from '@universal-login/commons';
import {ensureProperTransactionHash} from '../../../core/utils/validations';
import {Mineable} from '../../../core/models/Mineable';

export class SQLRepository<T extends Mineable> implements IRepository<T> {
  constructor(public knex: Knex, protected tableName: string) {
  }

  async add(hash: string, item: T) {
    return this.knex
      .insert({
        hash,
        ...item
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
      .delete()
      .where('hash', hash);
    return item;
  }

  async setState(hash: string, state: MineableState) {
    return this.knex(this.tableName)
      .where('hash', hash)
      .update('state', state);
  }

  async markAsPending(hash: string, transactionHash: string) {
    ensureProperTransactionHash(transactionHash);
    return this.knex(this.tableName)
      .where('hash', hash)
      .update('transactionHash', transactionHash)
      .update('state', 'Pending');
  }

  async markAsError(hash: string, error: string) {
    return this.knex(this.tableName)
      .where('hash', hash)
      .update('error', error)
      .update('state', 'Error');
  }
}

export default SQLRepository;

import Knex from 'knex';
import {NotFound} from '../../../core/utils/errors';
import IRepository from '../../../core/services/messages/IRepository';

export class SQLRepository<T> implements IRepository<T> {
  constructor(public knex: Knex, protected tableName: string) {
  }

  async add(hash: string, item: T) {
    return this.knex
      .insert({
        messageHash: hash,
        ...item
      })
      .into(this.tableName);
  }

  async get(hash: string) {
    const item = await this.knex(this.tableName)
      .where('messageHash', hash)
      .first();

    if (!item) {
      throw new NotFound(hash, 'NotFound');
    }
    return item;
  }

  async isPresent(hash: string) {
    const item = await this.knex(this.tableName)
      .where('messageHash', hash)
      .first();

    return !!item;
  }

  async remove(hash: string) {
    const item = await this.get(hash);
    await this.knex(this.tableName)
      .delete()
      .where('messageHash', hash);
    return item;
  }
}

export default SQLRepository;

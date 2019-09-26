import {NotFound} from '../../lib/core/utils/errors';
import IRepository from '../../lib/core/services/messages/IRepository';

export default class MemoryRepository<T> implements IRepository<T> {
  public items: Record<string, T>;

  constructor () {
    this.items = {};
  }

  async add(hash: string, item: T) {
    this.items[hash] = item;
  }

  async isPresent(hash: string) {
    return hash in this.items;
  }

  async get(hash: string): Promise<T> {
    if (!this.items[hash]) {
      throw new NotFound(hash, 'NotFound');
    }
    return this.items[hash];
  }

  async remove(hash: string): Promise<T> {
    const item = this.items[hash];
    delete this.items[hash];
    return item;
  }
}

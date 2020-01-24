import {cast, Sanitizer} from '@restless/sanitizers';
import {IStorageService} from '../models/IStorageService';

export class StorageEntry<T> {
  constructor(private key: string, private sanitizer: Sanitizer<T>, private storageService: IStorageService) {}

  get(): T | null {
    const json = this.storageService.get(this.key);
    if (!json) {
      return null;
    }
    const parsed = JSON.parse(json);
    return cast(parsed, this.sanitizer);
  }

  set(value: T) {
    this.storageService.set(this.key, JSON.stringify(value));
  }

  remove() {
    this.storageService.remove(this.key);
  }
}

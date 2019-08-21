import { cast, Sanitizer } from '@restless/sanitizers';

export class StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}

export class StorageEntry<T> {
  constructor(
    private key: string,
    private sanitizer: Sanitizer<T>,
    private storageService: StorageService,
  ) {}


  get(): T | null {
    const json = this.storageService.get(this.key);
    if (!json) { return null; }

    const parsed = JSON.parse(json);
    return cast(parsed, this.sanitizer);
  }

  set(value: T) {
    this.storageService.set(this.key, JSON.stringify(value));
  }
}

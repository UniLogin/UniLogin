export class StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}

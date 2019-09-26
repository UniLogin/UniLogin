export default interface IRepository<T> {
  add: (hash: string, item: T) => Promise<void>;
  get: (hash: string) => Promise<T>;
  isPresent: (hash: string) => Promise<boolean>;
  remove: (hash: string) => Promise<T>;
}

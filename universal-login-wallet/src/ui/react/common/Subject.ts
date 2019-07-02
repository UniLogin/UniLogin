export type Unsubscribe = () => void;

export interface Subject<T> {
  subscribe (callback: (event: T) => void): Unsubscribe;
}

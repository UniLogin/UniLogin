export type Unsubscribe = () => void;

export interface Subscriber<T> {
  subscribe (callback: (event: T) => void): Unsubscribe;
}

declare module 'use-subscription' {
  export interface Subscribable<T> {
    getCurrentValue: () => T;
    subscribe: (cb: () => void) => () => void;
  }

  export function useSubscription<T>(subscribable: Subscribable<T>): T;
}

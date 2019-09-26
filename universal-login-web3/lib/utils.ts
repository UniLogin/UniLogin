import {Property} from 'reactive-properties';

export function waitFor<T>(predicate: (value: T) => boolean): (prop: Property<T>) => Promise<void> {
  return (source) => new Promise((resolve) => {
    const unsubscribe = source.subscribe(() => {
      if (predicate(source.get())) {
        resolve();
        unsubscribe();
      }
    });
  });
}

export const waitForTrue = waitFor((x: boolean) => x);

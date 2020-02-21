import {Callback, Property, State, withEffect} from 'reactive-properties';

type MaybePromise<T> = T | Promise<T>;

export function propertyFromSubscription<T>(subscribe: (cb: (value: T) => void) => MaybePromise<Callback>, initialValue: T): Property<T> {
  const state = new State(initialValue);
  return state.pipe(
    withEffect(() => unpromiseCallback(subscribe(value => state.set(value)))),
  );
}

function unpromiseCallback(callback: MaybePromise<Callback>): Callback {
  if (!(callback instanceof Promise)) {
    return callback;
  }
  return () => setTimeout(async () => (await callback)());
}

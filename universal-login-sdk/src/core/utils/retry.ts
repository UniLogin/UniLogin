import {ensure, sleep} from '@unilogin/commons';
import {TimeoutError} from './errors';

export async function retry<R>(
  callback: () => R | Promise<R>,
  predicate: (result: R) => boolean,
  timeout = 5000,
  tick = 1000,
) {
  const stopTime = Date.now() + timeout;
  let result: R;
  do {
    ensure(stopTime > Date.now(), TimeoutError);
    result = await callback();
    await sleep(tick);
  } while (predicate(result));
  return result;
}

import {ensure, sleep} from '@universal-login/commons';

export async function retry<R>(
  callback: () => R | Promise<R>,
  predicate : (result: R) => boolean,
  timeout: number = 5000,
  tick: number = 1000
) {
  const stopTime = Date.now() + timeout;
  let result: R;
  do {
    ensure(stopTime > Date.now(), Error, 'Timeout');
    result = await callback();
    await sleep(tick);
  } while (predicate(result));
  return result;
}

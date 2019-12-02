import {Predicate} from '../types/common';

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waitUntil = async (predicate: Predicate, tick = 5, timeout = 1000, args: any[] = []) => {
  let elapsed = 0;
  while (!await predicate(...args)) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }
    await sleep(tick);
    elapsed += tick;
  }
  return true;
};

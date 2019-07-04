import {Predicate} from '../types/common';
import Assertion = Chai.Assertion;

export const sleep = (ms : number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waitUntil = async (predicate : Predicate, tick: number = 5, timeout: number = 1000, args: any[] = []) => {
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

export async function waitExpect(callback: () => void | Promise<void> | Assertion, timeout: number = 1000, tick: number = 5) {
  let elapsed = 0;
  let lastError;
  while (elapsed < timeout) {
    try {
      await callback();
      return;
    } catch (e) {
      await sleep(tick);
      elapsed += tick;
      lastError = e;
    }
  }
  throw lastError;
}

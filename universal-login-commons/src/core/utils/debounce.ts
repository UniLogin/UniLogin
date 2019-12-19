import {Procedure} from '../types/common';

export function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds: number,
): F {
  let timeoutId: any;
  return function (this: any, ...args: any[]) {
    const doLater = () => {
      timeoutId = undefined;
      func.apply(this, args);
    };
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(doLater, waitMilliseconds);
  } as any;
}

import {Procedure} from '../core/types/common';

export function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds: number,
): F {
  let timeoutId: any;
  return function (this: any, ...args: any[]) {
    const context = this;
    const doLater = function () {
      timeoutId = undefined;
      func.apply(context, args);
    };
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(doLater, waitMilliseconds);
  } as any;
}

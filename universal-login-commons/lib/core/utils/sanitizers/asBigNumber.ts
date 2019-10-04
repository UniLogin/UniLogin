import {utils} from 'ethers';
import {Sanitizer, Result} from '@restless/sanitizers';

export const asBigNumber: Sanitizer<utils.BigNumber> = (value, path) => {
  try {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'object') {
      if (value !== null) {
        return Result.ok(utils.bigNumberify(value.toString()));
      }
    }
  } catch {}
  return Result.error([{path, expected: 'big number'}]);
};

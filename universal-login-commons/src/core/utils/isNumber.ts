import {Result, asNumber} from '@restless/sanitizers';

export const isNumber = (value: unknown): boolean => {
  return Result.isOk(asNumber(value, ''));
};

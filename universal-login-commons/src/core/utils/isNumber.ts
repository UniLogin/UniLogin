import {Result, asNumber} from '@restless/sanitizers';

export const isNumber = (value: string): boolean => {
  return Result.isOk(asNumber(value, ''));
};

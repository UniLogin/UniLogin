import {Result, asNumber} from '@restless/sanitizers';

export const isStringANumber = (value: string): boolean => {
  return Result.isOk(asNumber(value, ''));
}
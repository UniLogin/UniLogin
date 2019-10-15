import {utils} from 'ethers';
import {Sanitizer, Result} from '@restless/sanitizers';

export const asProperHash : (length: number) => Sanitizer<string> = (length: number) => {
  return (value: unknown, path: string) => {
    try {
      if (typeof value === 'string') {
        if (utils.isHexString(value) && value.length === length) {
          return Result.ok(value);
        }
      }
    } catch {}
    return Result.error([{path, expected: `proper hash with length of ${length}, including 0x prefix`}]);
  };
};

export const asDeploymentHash : Sanitizer<string> = asProperHash(66);

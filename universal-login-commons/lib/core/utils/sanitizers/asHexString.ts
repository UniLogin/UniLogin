import {utils} from 'ethers';
import {Sanitizer, Result} from '@restless/sanitizers';

export const asHexString: (length: number) => Sanitizer<string> = (length: number) => {
  return (value: unknown, path: string) => {
    if (typeof value === 'string' && utils.isHexString(value) && value.length === length) {
      return Result.ok(value);
    }
    return Result.error([{path, expected: `proper hash with length of ${length}, including 0x prefix`}]);
  };
};

export const asDeploymentHash: Sanitizer<string> = asHexString(66);

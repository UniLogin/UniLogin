import { Sanitizer, Either, asObject, asOptional } from '@restless/restless';
import {TransactionOverrides} from '@universal-login/commons';
import { utils } from 'ethers';

export const asBigNumberish: Sanitizer<utils.BigNumber> = (value, path) => {
  if (typeof value === 'string' || typeof value === 'number') {
    try {
      const bigNumber = utils.bigNumberify(value);
      return Either.right(bigNumber);
    } catch {
      return Either.left([{ path, expected: 'bigNumber' }]);
    }
  }
  return Either.left([{ path, expected: 'bigNumber' }]);
};

export const asArrayish: Sanitizer<string | number[]> = (value, path) => {
  if (typeof value === 'string') {
    return Either.right(value);
  } else if (Array.isArray(value)) {
    return Either.right(value);
  } else {
    return Either.left([{ path, expected: 'arrayish' }]);
  }
};

export const asOverrideOptions: Sanitizer<TransactionOverrides> = asObject({
  gasLimit: asOptional(asBigNumberish),
  gasPrice: asOptional(asBigNumberish)
});

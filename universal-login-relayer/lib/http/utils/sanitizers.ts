import { Sanitizer, Either, asObject, asOptional, asString } from '@restless/restless';
import {TransactionOverrides, CancelAuthorisationRequest, GetAuthorisationRequest} from '@universal-login/commons';
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

export const asCancelAuthorisationRequest: Sanitizer<CancelAuthorisationRequest> = asObject({
  walletContractAddress: asString,
  publicKey: asString,
  signature: asString
});

export const asGetAuthorisationRequest: Sanitizer<GetAuthorisationRequest> = asObject({
  walletContractAddress: asString,
  signature: asString
});

export const asOverrideOptions: Sanitizer<TransactionOverrides> = asObject({
  gasLimit: asOptional(asBigNumberish),
  gasPrice: asOptional(asBigNumberish)
});

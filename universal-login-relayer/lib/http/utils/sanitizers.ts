import { Sanitizer, Result, asObject, asOptional, asString } from '@restless/sanitizers';
import {TransactionOverrides, RelayerRequest} from '@universal-login/commons';
import {asEthAddress, asBigNumber} from '@restless/ethereum';

export const asArrayish: Sanitizer<string | number[]> = (value, path) => {
  if (typeof value === 'string') {
    return Result.ok(value);
  } else if (Array.isArray(value)) {
    return Result.ok(value);
  } else {
    return Result.error([{ path, expected: 'arrayish' }]);
  }
};

export const asAuthorisationRequest: Sanitizer<RelayerRequest> = asObject({
  contractAddress: asEthAddress,
  signature: asString
});

export const asOverrideOptions: Sanitizer<TransactionOverrides> = asObject({
  gasLimit: asOptional(asBigNumber),
  gasPrice: asOptional(asBigNumber)
});

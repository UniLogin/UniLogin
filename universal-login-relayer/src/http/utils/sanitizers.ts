import {Sanitizer, Result, asObject, asOptional, asString} from '@restless/sanitizers';
import {TransactionOverrides, RelayerRequest, ApplicationInfo} from '@unilogin/commons';
import {asEthAddress, asBigNumber} from '@restless/ethereum';

export const asArrayish: Sanitizer<string | number[]> = (value, path) => {
  if (typeof value === 'string') {
    return Result.ok(value);
  } else if (Array.isArray(value)) {
    return Result.ok(value);
  } else {
    return Result.error([{path, expected: 'arrayish'}]);
  }
};

export const asRelayerRequest: Sanitizer<RelayerRequest> = asObject({
  contractAddress: asEthAddress,
  signature: asString,
});

export const asOverrideOptions: Sanitizer<TransactionOverrides> = asObject({
  gasLimit: asOptional(asBigNumber),
  gasPrice: asOptional(asBigNumber),
});

export const asApplicationInfo: Sanitizer<ApplicationInfo> = asObject({
  applicationName: asString,
  type: asString,
  logo: asString,
});

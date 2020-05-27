import {asAnyOf, asArray, asExactly, asNumber, asString, Sanitizer, asObject, asOptional} from '@restless/sanitizers';
import {asBigNumber, asEthAddress} from '@restless/ethereum';
import {OperationType, Message, PartialRequired} from '../../..';

export const asOperationType: Sanitizer<OperationType> = asAnyOf([
  asExactly(OperationType.call),
  asExactly(OperationType.externalCall),
], 'OperationType');

export const asPartialMessage = asObject<PartialRequired<Message, 'to'>>({
  to: asEthAddress,
  from: asEthAddress,
  nonce: asOptional(asAnyOf([asString, asNumber], 'string or number')),
  data: asOptional(asAnyOf([asString, asArray(asNumber)], 'string or number array')),
  value: asOptional(asBigNumber),
  gasLimit: asOptional(asBigNumber),
  gasPrice: asOptional(asBigNumber),
});

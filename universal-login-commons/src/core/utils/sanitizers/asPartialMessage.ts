import {asAnyOf, asArray, asExactly, asNumber, asString, Sanitizer, asObject} from '@restless/sanitizers';
import {asBigNumber} from '@restless/ethereum';
import {OperationType, Message, PartialRequired} from '../../..';

export const asOperationType: Sanitizer<OperationType> = asAnyOf([
  asExactly(OperationType.call),
  asExactly(OperationType.externalCall),
], 'OperationType');

export const asPartialMessage = asObject<PartialRequired<Message, 'to' | 'data' | 'value'>>({
  to: asString,
  data: asAnyOf([asString, asArray(asNumber)], 'string or number array'),
  value: asBigNumber,
  gasLimit: asBigNumber,
});

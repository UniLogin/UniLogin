import {asAnyOf, asArray, asExactly, asNumber, asString, Sanitizer} from '@restless/sanitizers';
import {Message, OperationType} from '../../..';
import {asBigNumber} from './asBigNumber';
import {asPartialObject} from './asPartialObject';

export const asOperationType: Sanitizer<OperationType> = asAnyOf([
  asExactly(OperationType.call),
  asExactly(OperationType.externalCall),
], 'OperationType');

export const asPartialMessage = asPartialObject<Message>({
  to: asString,
  from: asString,
  nonce: asAnyOf([asString, asNumber], 'string or number'),
  data: asAnyOf([asString, asArray(asNumber)], 'string or number array'),
  value: asBigNumber,
  operationType: asOperationType,
  gasLimit: asBigNumber,
  gasPrice: asBigNumber,
  gasToken: asString,
  refundReceiver: asString,
});

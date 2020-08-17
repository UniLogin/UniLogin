import {asObject, asString, Sanitizer, asNumber} from '@restless/sanitizers';
import {TransferDetails} from '../../..';
import {asGasParameters} from './asGasParameters';

export const asTransferDetails: Sanitizer<TransferDetails> = asObject<TransferDetails>({
  to: asString,
  amount: asString,
  transferToken: asString,
  decimals: asNumber,
  gasParameters: asGasParameters,
});

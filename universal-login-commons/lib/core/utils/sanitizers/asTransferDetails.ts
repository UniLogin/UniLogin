import {asObject, asString, Sanitizer} from '@restless/sanitizers';
import {TransferDetails} from '../../..';
import {asGasParameters} from './asGasParameters';

export const asTransferDetails: Sanitizer<TransferDetails> = asObject<TransferDetails>({
  to: asString,
  amount: asString,
  transferToken: asString,
  gasParameters: asGasParameters,
});

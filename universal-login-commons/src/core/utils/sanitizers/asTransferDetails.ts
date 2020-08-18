import {asObject, asString, Sanitizer, asNumber} from '@restless/sanitizers';
import {TransferDetails} from '../../..';
import {asGasParameters} from './asGasParameters';
import {TransferToken} from '../../models/transactions';

const asTransferToken: Sanitizer<TransferToken> = asObject<TransferToken>({
  address: asString,
  decimals: asNumber,
});

export const asTransferDetails: Sanitizer<TransferDetails> = asObject<TransferDetails>({
  to: asString,
  amount: asString,
  token: asTransferToken,
  gasParameters: asGasParameters,
});

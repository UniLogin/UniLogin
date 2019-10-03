import {asObject, asString, Sanitizer} from '@restless/sanitizers';
import {TransferDetails} from '../../..';
import {asEthAddress} from '@restless/ethereum';

export const asTransferDetails: Sanitizer<TransferDetails> = asObject<TransferDetails>({
  to: asEthAddress,
  amount: asString,
  currency: asString,
});

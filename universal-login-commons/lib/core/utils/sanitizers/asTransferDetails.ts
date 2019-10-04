import {asObject, asString, Sanitizer} from '@restless/sanitizers';
import {TransferDetails} from '../../..';
import {asEthAddress} from '@restless/ethereum';
import {asGasParameters} from './asGasParameters';

export const asTransferDetails: Sanitizer<TransferDetails> = asObject<TransferDetails>({
  to: asEthAddress,
  amount: asString,
  transferToken: asString,
  gasParameters: asGasParameters
});

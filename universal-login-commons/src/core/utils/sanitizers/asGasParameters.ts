import {asObject, Sanitizer, asString} from '@restless/sanitizers';
import {asBigNumber} from '@restless/ethereum';
import {GasParameters} from '../../models/gas';

export const asGasParameters: Sanitizer<GasParameters> = asObject<GasParameters>({
  gasToken: asString,
  gasPrice: asBigNumber,
});

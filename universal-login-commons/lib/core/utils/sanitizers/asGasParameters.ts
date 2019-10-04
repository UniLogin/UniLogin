import {asObject, Sanitizer, asString} from '@restless/sanitizers';
import {GasParameters} from '../../models/gas';
import {asBigNumber} from './asBigNumber';

export const asGasParameters: Sanitizer<GasParameters> = asObject<GasParameters>({
  gasToken: asString,
  gasPrice: asBigNumber
});

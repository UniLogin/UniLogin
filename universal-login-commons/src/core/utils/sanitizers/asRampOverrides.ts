import {asPartialObject, asString} from '@restless/sanitizers';
import {RampOverrides} from '../../models/onRamp';

export const asRampOverrides = asPartialObject<RampOverrides>({
  rampApiKey: asString,
  logoUrl: asString,
});

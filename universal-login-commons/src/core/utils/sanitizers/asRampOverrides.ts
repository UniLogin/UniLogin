import {asPartialObject, asString} from '@restless/sanitizers';
import {RampConfig} from '../../..';

export const asRampOverrides = asPartialObject<Pick<RampConfig, 'rampApiKey'>>({
  rampApiKey: asString,
});

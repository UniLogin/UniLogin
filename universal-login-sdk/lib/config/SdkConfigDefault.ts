import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {SdkConfig} from './SdkConfig';
import MESSAGE_DEFAULTS from '../core/utils/MessageDefaults';

export const SdkConfigDefault: SdkConfig = {
  paymentOptions: MESSAGE_DEFAULTS,
  observedTokens: [ETHER_NATIVE_TOKEN]
};

import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE} from '@universal-login/commons';
import {SdkConfig} from './SdkConfig';

export const SdkConfigDefault: SdkConfig = {
  paymentOptions: {
    gasToken: ETHER_NATIVE_TOKEN.address,
    gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
    gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE)
  },
  observedTokens: [
    {address: ETHER_NATIVE_TOKEN.address}
  ]
};

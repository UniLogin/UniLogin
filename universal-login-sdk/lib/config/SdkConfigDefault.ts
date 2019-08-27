import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE} from '@universal-login/commons';
import {SdkConfig} from './SdkConfig';

export const SdkConfigDefault: SdkConfig = {
  paymentOptions: {
    gasToken: ETHER_NATIVE_TOKEN.address,
    gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
    gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE)
  },
  observedTokensAddresses: [
    ETHER_NATIVE_TOKEN.address
  ],
  observedCurrencies: [
    'USD',
    'EUR',
    'BTC'
  ],
  authorisationsObserverTick: 1000,
  executionFactoryTick: 1000,
};

import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from './constants';
import {PaymentOptions} from '../models/message';

export const DEFAULT_GAS_PRICE = 10000000000;

export const DEFAULT_GAS_LIMIT = 200000;

export const DEFAULT_GAS_LIMIT_EXECUTION = 80000;

export const DEPLOYMENT_REFUND = utils.bigNumberify(570000).div(5).mul(6);

export const GAS_BASE = 60000;

export const MINIMAL_DEPLOYMENT_GAS_LIMIT = DEPLOYMENT_REFUND.mul(3).div(2);

export const INITIAL_GAS_PARAMETERS = {
  gasToken: ETHER_NATIVE_TOKEN.address,
  gasPrice: utils.bigNumberify('0'),
};

export const EMPTY_GAS_OPTION = {
  token: {
    name: '',
    symbol: '',
    address: '',
  },
  gasPrice: utils.bigNumberify('0'),
};

export const DEFAULT_PAYMENT_OPTIONS: PaymentOptions = {
  gasToken: ETHER_NATIVE_TOKEN.address,
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
};

import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from './constants';

export const DEFAULT_GAS_PRICE = 20000000000;

export const DEFAULT_GAS_LIMIT = 500000;

export const SEND_TRANSACTION_GAS_LIMIT = utils.bigNumberify(200000);

export const DEFAULT_GAS_LIMIT_EXECUTION = 80000;

export const DEPLOYMENT_REFUND = utils.bigNumberify(570000);

export const GAS_BASE = 30000;

export const MAX_GAS_LIMIT = 500000;

export const INITIAL_GAS_PARAMETERS = {
  gasToken: ETHER_NATIVE_TOKEN.address,
  gasPrice: utils.bigNumberify('0'),
};

export const EMPTY_GAS_OPTION = {
  token: {
    name: '',
    symbol: '',
    address: '',
    decimals: 0,
  },
  gasPrice: utils.bigNumberify('0'),
};

export const ZERO_BYTE_GAS_COST = 4;
export const NON_ZERO_BYTE_GAS_COST = 68;
export const ISTANBUL_NON_ZERO_BYTE_GAS_COST = 16;
export const GAS_FIXED = '50000';

export const TRANSACTION_HASH_CALCULATION_COST = 25000;
export const PAYMENT_COST = 8000;
export const REQUIRE_COST = 100;
export const TRANSACTION_COST = 21000;
export const EMIT_EVENT_COST = 1500;

export const CONSTANT_EXECUTION_COSTS = TRANSACTION_COST + TRANSACTION_HASH_CALCULATION_COST + PAYMENT_COST + REQUIRE_COST + EMIT_EVENT_COST; // ~ 56000

export const SIGNATURE_CHECK_COST = 5500;

export const ZERO_NONCE_COST = 20000;
export const NON_ZERO_NONCE_COST = 5000;

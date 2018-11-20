import {OPERATION_CALL} from 'universal-login-contracts';

const DEFAULT_PAYMENT_OPTIONS = {
  gasPrice: 1000000000,
  gasLimit: 1000000
};

const DEFAULTS = {
  operationType: OPERATION_CALL,
  value: 0,
  data: '0x0'
};

export {DEFAULT_PAYMENT_OPTIONS, DEFAULTS};

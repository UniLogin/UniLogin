import {OPERATION_CALL} from 'universal-login-contracts';

const MESSAGE_DEFAULTS = {
  gasPrice: 1000000000,
  gasLimit: 1000000,
  operationType: OPERATION_CALL,
  value: 0,
  data: '0x0'
};

export {MESSAGE_DEFAULTS};

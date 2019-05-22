import {OPERATION_CALL} from '@universal-login/commons';

const MESSAGE_DEFAULTS = {
  gasPrice: 1000000000,
  gasLimit: 1000000,
  operationType: OPERATION_CALL,
  value: 0,
  data: '0x0',
};

export default MESSAGE_DEFAULTS;

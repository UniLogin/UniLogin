import {UnsignedMessage, ensure, GAS_BASE} from '@universal-login/commons';
import {InsufficientGas} from './errors';

export const ensureSufficientGas = (unsingedMessage: UnsignedMessage) => {
  ensure(GAS_BASE < unsingedMessage.gasLimitExecution, InsufficientGas, `gasLimit should be greater than ${GAS_BASE}`);
};

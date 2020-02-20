import {UnsignedMessage, ensure, GAS_BASE} from '@unilogin/commons';
import {InsufficientGas} from './errors';

export const ensureSufficientGas = (unsingedMessage: UnsignedMessage) => {
  ensure(GAS_BASE < unsingedMessage.safeTxGas, InsufficientGas, `gasLimit should be greater than ${GAS_BASE}`);
};

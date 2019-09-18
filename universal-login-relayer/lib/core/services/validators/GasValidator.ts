import {estimateGasDataFromUnsignedMessage} from '@universal-login/contracts';
import {SignedMessage, ensure, GAS_BASE} from '@universal-login/commons';
import {InsufficientGas} from '../../utils/errors';
import IMessageValidator from './IMessageValidator';

export class GasValidator implements IMessageValidator {
  async validate(signedMessage: SignedMessage) {
    const {signature, ...unsignedMessage} = signedMessage;
    const expectedGasData = estimateGasDataFromUnsignedMessage(unsignedMessage);
    const actualGasData = Number(signedMessage.gasData);
    ensure(actualGasData === expectedGasData, InsufficientGas, `gasData: got ${actualGasData} but should be ${expectedGasData}`);
    ensure(GAS_BASE < signedMessage.gasLimitExecution, InsufficientGas, `gasLimitExecution: got ${signedMessage.gasLimitExecution} but should be greater than ${GAS_BASE}`);
  }
}

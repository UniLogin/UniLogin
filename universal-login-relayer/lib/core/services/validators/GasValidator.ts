import {estimateGasDataFromUnsignedMessage} from '@universal-login/contracts';
import {SignedMessage, ensure, GAS_BASE} from '@universal-login/commons';
import {InsufficientGas, GasLimitTooHigh} from '../../utils/errors';
import IMessageValidator from './IMessageValidator';

export class GasValidator implements IMessageValidator {
  constructor(private MAX_GAS_LIMIT: number) {}

  async validate(signedMessage: SignedMessage) {
    const {signature, ...unsignedMessage} = signedMessage;
    const expectedGasData = estimateGasDataFromUnsignedMessage(unsignedMessage);
    const actualGasData = Number(signedMessage.gasData);
    ensure(actualGasData === expectedGasData, InsufficientGas, `Got GasData ${actualGasData} but should be ${expectedGasData}`);
    ensure(GAS_BASE < signedMessage.gasLimitExecution, InsufficientGas, `Got GasLimitExecution ${signedMessage.gasLimitExecution} but should greater than ${GAS_BASE}`);

    const gasLimitExecution = Number(signedMessage.gasLimitExecution);
    const totalGasLimit = gasLimitExecution + actualGasData;
    ensure(totalGasLimit <= this.MAX_GAS_LIMIT, GasLimitTooHigh, `Got ${totalGasLimit} but should be less than ${this.MAX_GAS_LIMIT}`);
  }
}

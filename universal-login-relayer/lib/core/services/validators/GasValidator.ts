import {estimateGasDataFromSignedMessage, NOT_COMPUTED_FIELDS_GAS_FEE} from '@universal-login/contracts';
import {SignedMessage, ensure} from '@universal-login/commons';
import {InvalidGasPrice} from '../../utils/errors';

export const GAS_BASE = 0;

export class GasValidator {
  validate(signedMessage: SignedMessage) {
    const expectedGasData = estimateGasDataFromSignedMessage(signedMessage);
    const actualGasData = Number(signedMessage.gasData);
    ensure(actualGasData >= expectedGasData - NOT_COMPUTED_FIELDS_GAS_FEE, InvalidGasPrice, `Equals ${actualGasData} but should be greater or equal to ${expectedGasData - NOT_COMPUTED_FIELDS_GAS_FEE}`);
    ensure(actualGasData <= expectedGasData, InvalidGasPrice, `Equals ${actualGasData} but should be less or equal to ${expectedGasData}`);
    ensure(signedMessage.gasLimitExecution > GAS_BASE, Error);
  }
}

import {Validator, TransferErrors} from './Validator';
import {TransferDetails} from '@universal-login/commons';

const isNumber = /^[0-9]+(\.[0-9]+)?$/;

export class NumberValidator extends Validator <TransferDetails> {
  validate(transferDetails: TransferDetails, errors: TransferErrors) {
    const {amount} = transferDetails;
    if (!amount.match(isNumber)) {
      errors['amount'].push(`Amount ${amount} is not a valid number`);
      return false;
    }
    return true;
  }
}

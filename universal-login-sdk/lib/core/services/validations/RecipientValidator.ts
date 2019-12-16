import {Validator, TransferErrors} from './Validator';
import {utils} from 'ethers';
import {isValidEnsName, TransferDetails} from '@universal-login/commons';

function isProperAddress(recipient: string): boolean {
  try {
    utils.getAddress(recipient);
  } catch (err) {
    return false;
  }
  return true;
}

export class RecipientValidator extends Validator<TransferDetails> {
  validate(transferDetails: TransferDetails, errors: TransferErrors) {
    if (isProperAddress(transferDetails.to)) {
      return true;
    } else if (isValidEnsName(transferDetails.to)) {
      return true; // resolve ENS name
    } else if (transferDetails.to.startsWith('0x')) {
      errors['to'].push(`${transferDetails.to} is not a valid address`);
    } else {
      errors['to'].push(`${transferDetails.to} is not a valid address or ENS name`);
    }
  }
}

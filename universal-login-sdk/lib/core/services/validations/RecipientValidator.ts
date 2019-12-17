import {Validator, TransferErrors} from './Validator';
import {utils} from 'ethers';
import {isValidEnsName, TransferDetails} from '@universal-login/commons';
import UniversalLoginSDK from '../../../api/sdk';

const isProperAddress = (recipient: string): boolean => {
  try {
    utils.getAddress(recipient);
  } catch (err) {
    return false;
  }
  return true;
};

export class RecipientValidator extends Validator<TransferDetails> {
  constructor(private readonly sdk: UniversalLoginSDK) {
    super();
  }

  async validate(transferDetails: TransferDetails, errors: TransferErrors) {
    const recipient = transferDetails.to;
    if (!recipient) {
      errors['to'].push('Empty recipient');
    } else if (isProperAddress(recipient)) {
      return true;
    } else if (isValidEnsName(recipient)) {
      const resolvedEnsName = await this.sdk.resolveName(recipient);
      if (resolvedEnsName) {
        return true;
      }
      errors['to'].push(`${recipient} is not a valid ENS name`);
    } else if (recipient.startsWith('0x')) {
      errors['to'].push(`${recipient} is not a valid address`);
    } else {
      errors['to'].push(`${recipient} is not a valid address or ENS name`);
    }
  }
}

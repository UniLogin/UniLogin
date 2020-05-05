import {Validator, TransferErrors} from './Validator';
import {utils} from 'ethers';
import {isValidEnsName, TransferDetails} from '@unilogin/commons';
import UniLoginSdk from '../../../api/sdk';
import {AddressZero} from 'ethers/constants';

const isProperAddress = (recipient: string): boolean => {
  try {
    utils.getAddress(recipient);
  } catch (err) {
    return false;
  }
  return true;
};

export class RecipientValidator implements Validator<TransferDetails> {
  constructor(private readonly sdk: UniLoginSdk) {
  }

  async validate(transferDetails: TransferDetails, errors: TransferErrors) {
    const recipient = transferDetails.to;
    if (!recipient) {
      errors['to'].push('Empty recipient');
    } else if (isProperAddress(recipient)) {
    } else if (isValidEnsName(recipient)) {
      const resolvedEnsName = await this.sdk.resolveName(recipient);
      if (resolvedEnsName && resolvedEnsName !== AddressZero) {
        return;
      }
      errors['to'].push(`Can't resolve ENS address: ${recipient}`);
    } else if (recipient.startsWith('0x')) {
      errors['to'].push(`${recipient} is not a valid address`);
    } else {
      errors['to'].push(`${recipient} is not a valid address or ENS name`);
    }
  }
}

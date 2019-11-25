import {isProperAddress} from './hexStrings';
import {isValidEnsName} from './ens';

export const isValidRecipient = (recipient?: string): boolean => {
  if (recipient) {
    return isProperAddress(recipient) || isValidEnsName(recipient);
  }
  return false;
};

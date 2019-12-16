import {TransferDetails} from '@universal-login/commons';
import {AmountValidator} from './AmountValidator';

const isNumber = /^[0-9]+(\.[0-9]+)?$/;

export const validateAmount = (transferDetails: TransferDetails, balance: string): string[] => {
  const errors = {amount: []};
  if (!transferDetails.amount.match(isNumber)) {
    return [`Amount ${transferDetails.amount} is not a valid number`];
  }
  new AmountValidator(balance).validate(transferDetails, errors);
  return errors['amount'];
};

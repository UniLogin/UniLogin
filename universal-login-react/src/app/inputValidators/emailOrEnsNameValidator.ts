import {isValidEnsName, isProperEmail} from '@unilogin/commons';

export const isValidEmailOrEnsName = (value: string) => isValidEnsName(value) || isProperEmail(value);

export const ensNameOrEmailValidator = {
  validate: isValidEmailOrEnsName,
  errorMessage: 'Invalid ENS name or email',
};

import {isProperEmail} from '@unilogin/commons';

export const emailValidator = {
  validate: isProperEmail,
  errorMessage: 'Email is not valid',
};

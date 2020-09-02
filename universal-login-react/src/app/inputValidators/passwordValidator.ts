import {isProperPassword} from '@unilogin/commons';

export const passwordValidator = {
  validate: isProperPassword,
  errorMessage: 'Password must have more than 10 letters and one capital letter',
};

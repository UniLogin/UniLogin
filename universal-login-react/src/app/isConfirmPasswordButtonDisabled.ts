import {isProperPassword} from '@unilogin/commons';

export const isConfirmPasswordButtonDisabled = (password: string, confirmedPassword: string) =>
  !(isProperPassword(password) && password === confirmedPassword);

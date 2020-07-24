import {isProperPassword} from '@unilogin/commons';

export const isConfirmPasswordButtonDisabled = (password?: string, confirmedPassword?: string) =>
  !(!!password && !!confirmedPassword && isProperPassword(password) && password === confirmedPassword);

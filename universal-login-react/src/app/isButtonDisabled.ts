import {isProperPassword} from '@unilogin/commons';

export const isButtonDisabled = (password?: string, confirmedPassword?: string) =>
  !(!!password && !!confirmedPassword && isProperPassword(password) && password === confirmedPassword);

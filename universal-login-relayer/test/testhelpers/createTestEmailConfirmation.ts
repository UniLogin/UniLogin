import {EmailConfirmation} from '@unilogin/commons';

export const createTestEmailConfirmation = (email = 'account@unilogin.test') => ({
  email: 'account@unilogin.test',
  code: '012345',
  ensName: 'account.unilogin.test',
  createdAt: new Date(),
  isConfirmed: false,
} as EmailConfirmation);

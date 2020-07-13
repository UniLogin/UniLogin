import {EmailConfirmation} from '@unilogin/commons';

export const createTestEmailConfirmation = (email = 'account@unilogin.test') => ({
  email,
  code: '012345',
  ensName: 'account.unilogin.test',
  createdAt: new Date(),
  isConfirmed: false,
} as EmailConfirmation);

import {InvalidWalletState} from '@unilogin/sdk';

export const getRedirectPathForConfirmCode = (kind: string) => {
  switch (kind) {
    case 'Confirmed':
      return '/create';
    case 'Restoring':
      return '/restore';
    default:
      throw new InvalidWalletState('Confirmed or Restoring', kind);
  }
};

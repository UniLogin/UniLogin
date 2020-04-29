import {WalletState} from '@unilogin/sdk';

export const getDefaultPathForWalletState = ({kind}: WalletState) => {
  switch (kind) {
    case 'Future':
      return '/create/topUp';
    case 'Deployed':
      return '/dashboard';
    case 'None':
      return '/welcome';
    case 'Deploying':
      return '/create/waiting';
    case 'Connecting':
      return '/connect/emoji';
  }
};

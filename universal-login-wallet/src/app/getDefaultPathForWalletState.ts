import {WalletState} from '@universal-login/sdk';

export const getDefaultPathForWalletState = ({kind}: WalletState) => {
  switch (kind) {
    case 'Future':
      return '/create';
    case 'Deployed':
      return '/wallet';
    case 'None':
      return '/welcome';
    case 'Deploying':
      return '/create';
  }
};

import {WalletState} from '@unilogin/sdk';
import {UnexpectedWalletState} from '@unilogin/react';

export const getDefaultPathForWalletState = ({kind}: WalletState) => {
  switch (kind) {
    case 'Future':
      return '/create/topUp';
    case 'Deployed':
    case 'DeployedWithoutEmail':
      return '/dashboard';
    case 'None':
      return '/welcome';
    case 'Deploying':
      return '/create/waiting';
    case 'Connecting':
      return '/connect/emoji';
    default:
      throw new UnexpectedWalletState(kind);
  }
};

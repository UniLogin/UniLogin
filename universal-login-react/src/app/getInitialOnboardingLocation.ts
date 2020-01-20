import {WalletState} from '@universal-login/sdk';
import {LocationDescriptorObject} from 'history';
import {UnexpectedWalletState} from '../core/utils/errors';

export const getInitialOnboardingLocation = (state: WalletState): string | LocationDescriptorObject => {
  switch (state.kind) {
    case 'None':
      return '/selector';
    case 'Connecting':
      return {
        pathname: '/connectFlow/emoji',
        state: {name: state.wallet.name},
      };
    case 'Future':
    case 'Deploying':
      return '/create';
    case 'Deployed':
      throw new UnexpectedWalletState('Deployed');
  }
};

import {WalletState} from '@unilogin/sdk';
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
    case 'RequestedRestoring':
    case 'RequestedCreating':
    case 'Confirmed':
    case 'Deployed':
    case 'Restoring':
      throw new UnexpectedWalletState(state.kind);
  }
};

export const getInitialEmailOnboardingLocation = (state: WalletState): string | LocationDescriptorObject => {
  switch (state.kind) {
    case 'None':
      return '/email';
    case 'RequestedCreating':
    case 'RequestedRestoring':
      return '/code';
    case 'Confirmed':
    case 'Restoring':
    case 'Future':
    case 'Deploying':
      return '/create';
    case 'Deployed':
    case 'Connecting':
      throw new UnexpectedWalletState(state.kind);
  }
};

import {AbstractWallet} from './AbstractWallet';

export class ConnectingWallet extends AbstractWallet {
  subscription?: {remove: () => void};

  setSubscription(subscription: {remove: () => void}) {
    this.subscription = subscription;
  }
}

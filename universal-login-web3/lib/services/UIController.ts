import {Property, State, combine} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';
import {MetamaskService} from './MetamaskService';

export class UIController {
  private walletNeeded = new State(false);
  public showOnboarding: Property<boolean>;

  constructor(
    walletService: WalletService,
    metamaskService: MetamaskService
  ) {
    this.showOnboarding = combine(
      [this.walletNeeded, walletService.stateProperty, metamaskService.metamaskProvider],
      (needed, state, metamask) => needed && state.kind !== 'Deployed' && !metamask,
    );
  }

  requireWallet() {
    this.walletNeeded.set(true);
  }
}

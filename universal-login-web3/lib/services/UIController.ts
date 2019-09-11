import {Property, State, combine} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';

export class UIController {
  private walletNeeded = new State(false);
  public showOnboarding: Property<boolean>;

  constructor(walletService: WalletService) {
    this.showOnboarding = combine(
      [this.walletNeeded, walletService.stateProperty],
      (needed, state) => needed && state.kind !== 'Deployed',
    );
  }

  requireWallet() {
    this.walletNeeded.set(true);
  }
}

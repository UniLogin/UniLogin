import {Property, State, combine} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';

export class UIController {
  private walletNeeded = new State(false);
  showOnboarding: Property<boolean>;
  showConfirmation = new State(false);

  private resolveConfirm?: (value: boolean) => void;

  constructor(
    walletService: WalletService,
  ) {
    this.showOnboarding = combine(
      [this.walletNeeded, walletService.stateProperty],
      (needed, state) => needed && state.kind !== 'Deployed',
    );
  }

  requireConfirmation() {
    this.showConfirmation.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolveConfirm = resolve;
    });
  }

  setResponse(response: boolean) {
    this.showConfirmation.set(false);
    this.resolveConfirm?.(response);
  }

  requireWallet() {
    this.walletNeeded.set(true);
  }
}

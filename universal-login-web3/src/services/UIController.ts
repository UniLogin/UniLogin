import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';

export class UIController {
  activeModal = new State<'ONBOARDING' | 'CONFIRMATION' | 'IDLE'>('IDLE');

  private resolveConfirm?: (value: boolean) => void;

  constructor(
    private walletService: WalletService,
  ) {}

  finishOnboarding() {
    this.activeModal.set('IDLE');
  }

  requireConfirmation() {
    this.activeModal.set('CONFIRMATION');
    return new Promise<boolean>((resolve) => {
      this.resolveConfirm = resolve;
    });
  }

  setResponse(response: boolean) {
    this.activeModal.set('IDLE');
    this.resolveConfirm?.(response);
  }

  requireWallet() {
    if (this.walletService.state.kind !== 'Deployed') {
      this.activeModal.set('ONBOARDING');
    };
  }
}

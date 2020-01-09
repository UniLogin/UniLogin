import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';

export class UIController {
  activeModal = new State<'ONBOARDING' | 'CONFIRMATION' | 'WAIT_FOR_TRANSACTION' | 'IDLE'>('IDLE');
  transactionHash: State<string | undefined> = new State(undefined);
  confirmationTitle?: string;
  private resolveConfirm?: (value: boolean) => void;

  constructor(
    private walletService: WalletService,
  ) {}

  finishOnboarding() {
    this.hideModal();
  }

  requireConfirmation(title: string) {
    this.confirmationTitle = title;
    this.activeModal.set('CONFIRMATION');
    return new Promise<boolean>((resolve) => {
      this.resolveConfirm = resolve;
    });
  }

  showWaitForTransaction(transactionHash?: string) {
    this.transactionHash.set(transactionHash);
    this.activeModal.set('WAIT_FOR_TRANSACTION');
  }

  hideModal() {
    this.activeModal.set('IDLE');
  }

  setResponse(response: boolean) {
    this.hideModal();
    this.resolveConfirm?.(response);
  }

  requireWallet() {
    if (this.walletService.state.kind !== 'Deployed') {
      this.activeModal.set('ONBOARDING');
    };
  }
}

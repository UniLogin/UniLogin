import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});
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
    this.activeModal.set({kind: 'CONFIRMATION'});
    return new Promise<boolean>((resolve) => {
      this.resolveConfirm = resolve;
    });
  }

  showWaitForTransaction(transactionHash?: string) {
    this.transactionHash.set(transactionHash);
    this.activeModal.set({kind: 'WAIT_FOR_TRANSACTION'});
  }

  hideModal() {
    this.activeModal.set({kind: 'IDLE'});
  }

  setResponse(response: boolean) {
    this.hideModal();
    this.resolveConfirm?.(response);
  }

  requireWallet() {
    if (this.walletService.state.kind !== 'Deployed') {
      this.activeModal.set({kind: 'ONBOARDING'});
    };
  }
}

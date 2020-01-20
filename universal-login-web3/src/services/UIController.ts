import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';
import {ensure} from '@universal-login/commons';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});

  constructor(
    private walletService: WalletService,
  ) {}

  finishOnboarding() {
    this.hideModal();
  }

  confirmRequest(title: string) {
    return new Promise<boolean>((resolve) => {
      this.activeModal.set({
        kind: 'CONFIRMATION',
        props: {
          title,
          onConfirmationResponse: (response: boolean) => {
            this.hideModal();
            resolve(response);
          },
        },
      });
    });
  }

  showWaitForTransaction(transactionHash?: string) {
    this.activeModal.set({kind: 'WAIT_FOR_TRANSACTION', props: {transactionHash}});
  }

  hideModal() {
    this.activeModal.set({kind: 'IDLE'});
  }

  requireWallet() {
    ensure(this.walletService.state.kind !== 'Deployed', Error, 'InvalidState');
    this.activeModal.set({kind: 'ONBOARDING'});
  }
}

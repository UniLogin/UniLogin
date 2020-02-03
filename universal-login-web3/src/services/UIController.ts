import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';
import {ensure} from '@universal-login/commons';
import {UnexpectedWalletState} from '../ui/utils/errors';
import {ConfirmationResponse} from '../models/ConfirmationResponse';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});

  constructor(
    private walletService: WalletService,
  ) {}

  finishOnboarding() {
    this.hideModal();
  }

  confirmRequest(title: string): Promise<ConfirmationResponse> {
    return new Promise<ConfirmationResponse>((resolve) => {
      this.activeModal.set({
        kind: 'TRANSACTION_CONFIRMATION',
        props: {
          title,
          onConfirmationResponse: (response: ConfirmationResponse) => {
            this.hideModal();
            resolve(response);
          },
        },
      });
    });
  }

  signChallenge(title: string, signMessage: string) {
    return new Promise<boolean>((resolve) => {
      this.activeModal.set({
        kind: 'SIGN_CONFIRMATION',
        props: {
          title,
          signMessage,
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
    ensure(this.walletService.state.kind !== 'Deployed', UnexpectedWalletState, 'Deployed');
    this.activeModal.set({kind: 'ONBOARDING'});
  }
}

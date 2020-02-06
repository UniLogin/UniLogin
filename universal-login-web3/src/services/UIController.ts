import {State} from 'reactive-properties';
import {WalletService} from '@universal-login/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';
import {ensure, Message} from '@universal-login/commons';
import {UnexpectedWalletState} from '../ui/utils/errors';
import {ConfirmationResponse} from '../models/ConfirmationResponse';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});
  dashboardVisible = new State<boolean>(false);

  constructor(
    private walletService: WalletService,
  ) {}

  finishOnboarding() {
    this.hideModal();
  }

  confirmRequest(title: string, transaction: Partial<Message>): Promise<ConfirmationResponse> {
    return new Promise<ConfirmationResponse>((resolve) => {
      this.activeModal.set({
        kind: 'TRANSACTION_CONFIRMATION',
        props: {
          title,
          transaction,
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

  showError(errorMessage?: string) {
    this.activeModal.set({kind: 'ERROR', props: {errorMessage}});
  }

  requireWallet() {
    ensure(this.walletService.state.kind !== 'Deployed', UnexpectedWalletState, 'Deployed');
    this.activeModal.set({kind: 'ONBOARDING'});
  }

  openDashboard() {
    this.dashboardVisible.set(true);
  }

  closeDashboard() {
    this.dashboardVisible.set(false);
  }
}

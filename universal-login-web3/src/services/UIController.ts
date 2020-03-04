import {State, Property, combine} from 'reactive-properties';
import {WalletService} from '@unilogin/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';
import {ensure, Message} from '@unilogin/commons';
import {UnexpectedWalletState} from '../ui/utils/errors';
import {ConfirmationResponse} from '../models/ConfirmationResponse';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});
  dashboardVisible = new State<boolean>(false);
  isLoading = new State<boolean>(true);

  isUiVisible: Property<boolean>;

  constructor(
    private walletService: WalletService,
  ) {
    this.isUiVisible = combine(
      [this.activeModal, this.dashboardVisible],
      (state, dashboardVisible) => state.kind !== 'IDLE' || dashboardVisible,
    );
  }

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

  showLocalStorageWarning() {
    this.activeModal.set({kind: 'WARNING_LOCAL_STORAGE'});
  }

  setDashboardVisibility(visible: boolean) {
    this.dashboardVisible.set(visible);
  }

  finishAppInitialization() {
    this.isLoading.set(false);
  }
}

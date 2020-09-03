import {State, Property, combine} from 'reactive-properties';
import {WalletService} from '@unilogin/sdk';
import {ULWeb3ProviderState} from '../models/ULWeb3ProviderState';
import {ensure, Message, PartialRequired} from '@unilogin/commons';
import {UnexpectedWalletState, isRandomInfuraError} from '../ui/utils/errors';
import {ConfirmationResponse} from '../models/ConfirmationResponse';

export class UIController {
  activeModal = new State<ULWeb3ProviderState>({kind: 'IDLE'});
  dashboardVisible = new State<boolean>(false);
  isLoading = new State<boolean>(true);

  isUiVisible: Property<boolean>;

  constructor(
    private walletService: WalletService,
    private disabledDialogs: string[] = [],
  ) {
    this.isUiVisible = combine(
      [this.activeModal, this.dashboardVisible, this.isLoading],
      (state, dashboardVisible, isLoading) => state.kind !== 'IDLE' || dashboardVisible || isLoading,
    );
  }

  finishOnboarding() {
    this.hideModal();
  }

  confirmRequest(title: string, transaction: PartialRequired<Message, 'to' | 'from' | 'gasLimit' | 'value'>): Promise<ConfirmationResponse> {
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
    if (!this.disabledDialogs.includes('WAIT_FOR_TRANSACTION')) {
      this.activeModal.set({kind: 'WAIT_FOR_TRANSACTION', props: {transactionHash}});
    }
  }

  isWaitForTransaction() {
    return this.activeModal.get().kind === 'WAIT_FOR_TRANSACTION';
  }

  showTransactionHash(transactionHash: string) {
    if (this.isWaitForTransaction()) {
      this.showWaitForTransaction(transactionHash);
    }
  }

  hideWaitForTransaction() {
    if (this.isWaitForTransaction()) {
      this.hideModal();
    }
  }

  hideModal() {
    this.activeModal.set({kind: 'IDLE'});
  }

  showError(errorMessage?: string) {
    if (isRandomInfuraError(errorMessage) || this.disabledDialogs.includes('ERROR')) {
      return;
    }
    this.activeModal.set({kind: 'ERROR', props: {errorMessage}});
  }

  requireWallet() {
    ensure(!this.walletService.isDeployed(), UnexpectedWalletState, this.walletService.state.kind);
    this.activeModal.set({kind: 'ONBOARDING'});
  }

  showLocalStorageWarning() {
    this.activeModal.set({kind: 'WARNING_LOCAL_STORAGE'});
  }

  setDashboardVisibility(visible: boolean) {
    this.dashboardVisible.set(visible);
  }

  initializeApp() {
    this.isLoading.set(true);
  }

  finishAppInitialization() {
    this.isLoading.set(false);
  }
}

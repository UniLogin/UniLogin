import React from 'react';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {ErrorMessage, ModalWrapper, Onboarding, useProperty, ManualDashboard, AppPreloader} from '@unilogin/react';
import {UIController} from '../../services/UIController';
import {TransactionConfirmation} from './Confirmation/TransactionConfirmation';
import {WaitForTransactionModal} from './WaitingForTransactionModal';
import {SignConfirmation} from './Confirmation/SignConfirmation';
import {LocalStorageBlockedWarningScreen} from './warning/LocalStorageBlockedWarningScreen';

export interface ULWeb3RootProps {
  sdk: UniLoginSdk;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const ULWeb3Root = ({sdk, walletService, uiController, domains}: ULWeb3RootProps) => {
  const modal = useProperty(uiController.activeModal);
  const message = sdk.getNotice();
  const hideModal = () => uiController.hideModal();

  if (useProperty(uiController.isLoading) && modal.kind !== 'WARNING_LOCAL_STORAGE') {
    return <ModalWrapper><AppPreloader /></ModalWrapper>;
  }
  switch (modal.kind) {
    case 'IDLE':
      return <ManualDashboard
        walletService={walletService}
        isVisible={uiController.dashboardVisible}
        onClose={() => uiController.setDashboardVisibility(false)}
      />;
    case 'ONBOARDING':
      return <Onboarding
        walletService={walletService}
        domains={domains}
        hideModal={hideModal}
        emailFlow={true}
      />;
    case 'SIGN_CONFIRMATION':
      return <SignConfirmation message={message} {...modal.props} />;
    case 'TRANSACTION_CONFIRMATION':
      return <TransactionConfirmation message={message} walletService={walletService} onError={errorMessage => uiController.showError(errorMessage)} {...modal.props} />;
    case 'WAIT_FOR_TRANSACTION':
      return <WaitForTransactionModal
        transactionHash={modal.props.transactionHash}
        relayerConfig={sdk.getRelayerConfig()}
        onClose={hideModal}
      />;
    case 'ERROR':
      return <ModalWrapper
        message={message}
        hideModal={hideModal}
      >
        <ErrorMessage message={modal.props.errorMessage} />
      </ModalWrapper>;
    case 'WARNING_LOCAL_STORAGE':
      return <LocalStorageBlockedWarningScreen />;
    default:
      throw Error(`Invalid user interface state: ${modal}`);
  }
};

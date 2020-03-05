import React from 'react';
import UniversalLoginSDK, {WalletService} from '@unilogin/sdk';
import {ErrorMessage, ModalWrapper, Onboarding, useProperty, ManualDashboard, AppPreloader} from '@unilogin/react';
import {UIController} from '../../services/UIController';
import {TransactionConfirmation} from './Confirmation/TransactionConfirmation';
import {WaitForTransactionModal} from './WaitingForTransactionModal';
import {SignConfirmation} from './Confirmation/SignConfirmation';
import {LocalStorageBlockedWarningScreen} from './warning/LocalStorageBlockedWarningScreen';

export interface ULWeb3RootProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const ULWeb3Root = ({sdk, walletService, uiController, domains}: ULWeb3RootProps) => {
  const modal = useProperty(uiController.activeModal);
  const message = sdk.getNotice();
  const isLoading = useProperty(uiController.isLoading);

  switch (modal.kind) {
    case 'ONBOARDING':
      return <Onboarding
        sdk={sdk}
        walletService={walletService}
        domains={domains}
      />;
    case 'WARNING_LOCAL_STORAGE':
      return <LocalStorageBlockedWarningScreen />;
  }

  if (isLoading) {
    return <ModalWrapper><AppPreloader /></ModalWrapper>;
  }

  switch (modal.kind) {
    case 'IDLE':
      return <ManualDashboard
        walletService={walletService}
        isVisible={uiController.dashboardVisible}
        onClose={() => uiController.setDashboardVisibility(false)}
      />;
    case 'SIGN_CONFIRMATION':
      return <SignConfirmation message={message} {...modal.props} />;
    case 'TRANSACTION_CONFIRMATION':
      return <TransactionConfirmation message={message} walletService={walletService} onError={errorMessage => uiController.showError(errorMessage)} {...modal.props} />;
    case 'WAIT_FOR_TRANSACTION':
      return <WaitForTransactionModal
        transactionHash={modal.props.transactionHash}
        relayerConfig={sdk.getRelayerConfig()}
        onClose={() => uiController.hideModal()}
      />;
    case 'ERROR':
      return <ModalWrapper
        message={message}
        hideModal={() => uiController.hideModal()}
      >
        <ErrorMessage message={modal.props.errorMessage} />
      </ModalWrapper>;
    default:
      throw Error(`Invalid user interface state: ${modal}`);
  }
};

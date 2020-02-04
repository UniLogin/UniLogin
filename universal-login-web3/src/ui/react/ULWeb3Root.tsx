import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {ErrorMessage, ModalWrapper, OnboardingModal, useProperty} from '@universal-login/react';
import {UIController} from '../../services/UIController';
import {Confirmation} from './Confirmation/Confirmation';
import {WaitForTransactionModal} from './WaitingForTransactionModal';
import {SignConfirmation} from './Confirmation/SignConfirmation';

export interface ULWeb3RootProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const ULWeb3Root = ({sdk, walletService, uiController, domains}: ULWeb3RootProps) => {
  const modal = useProperty(uiController.activeModal);
  const message = sdk.getNotice();

  switch (modal.kind) {
    case 'IDLE':
      return <div />;
    case 'ONBOARDING':
      return <OnboardingModal
        sdk={sdk}
        walletService={walletService}
        domains={domains}
      />;
    case 'SIGN_CONFIRMATION':
      return <SignConfirmation message={message} {...modal.props} />;
    case 'CONFIRMATION':
      return <Confirmation message={message} {...modal.props} />;
    case 'WAIT_FOR_TRANSACTION':
      return <WaitForTransactionModal
        transactionHash={modal.props.transactionHash}
        relayerConfig={sdk.getRelayerConfig()}
      />;
    case 'ERROR':
      return <ModalWrapper
        message={message}
        hideModal={() => uiController.hideModal()}
      >
        <ErrorMessage message={modal.props.errorMessage}/>
      </ModalWrapper>;
    default:
      throw Error(`Invalid user interface state: ${modal}`);
  }
};

import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {OnboardingModal, useProperty} from '@universal-login/react';
import {UIController} from '../../services/UIController';
import {Confirmation} from './Confirmation';
import {WaitForTransactionModal} from './WaitingForTransactionModal';

export interface ULWeb3RootProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const ULWeb3Root = ({sdk, walletService, uiController, domains}: ULWeb3RootProps) => {
  const modal = useProperty(uiController.activeModal);

  switch (modal.kind) {
    case 'IDLE':
      return <div />;
    case 'ONBOARDING':
      return <OnboardingModal
        sdk={sdk}
        walletService={walletService}
        domains={domains}
      />;
    case 'CONFIRMATION':
      return <Confirmation {...modal.props} />;
    case 'WAIT_FOR_TRANSACTION':
      return <WaitForTransactionModal
        uiController={uiController}
        relayerConfig={sdk.getRelayerConfig()}
      />;
    default:
      throw Error(`Invalid user interface state: ${modal}`);
  }
};

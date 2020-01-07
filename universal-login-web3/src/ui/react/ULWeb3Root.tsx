import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {OnboardingModal, useProperty} from '@universal-login/react';
import {UIController} from '../../services/UIController';
import {Confirmation} from './Confirmation';

export interface ULWeb3RootProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const ULWeb3Root = ({sdk, walletService, uiController, domains}: ULWeb3RootProps) => {
  const showOnboarding = useProperty(uiController.showOnboarding);
  const showConfirmation = useProperty(uiController.showConfirmation);

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          sdk={sdk}
          walletService={walletService}
          domains={domains}
        />
      )}
      {showConfirmation && <Confirmation
        onConfirmationResponse={response => uiController.setResponse(response)}
      />}
    </>
  );
};

import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {OnboardingModal, useProperty} from '@universal-login/react';
import {UIController} from '../../services/UIController';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const Onboarding = ({sdk, walletService, uiController, domains}: OnboardingProps) => {
  const showOnboarding = useProperty(uiController.showOnboarding);

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          sdk={sdk}
          walletService={walletService}
          domains={domains}
        />
      )}
    </>
  );
};

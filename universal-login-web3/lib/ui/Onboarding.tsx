import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {OnboardingModal, useProperty} from '@universal-login/react';
import {UIController} from '../services/UIController';
import {MetamaskService} from '../services/MetamaskService';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  metamaskService: MetamaskService;
  domains: string[];
}

export const Onboarding = ({sdk, walletService, uiController, domains, metamaskService}: OnboardingProps) => {
  const showOnboarding = useProperty(uiController.showOnboarding);

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          sdk={sdk}
          walletService={walletService}
          domains={domains}
          tryEnablingMetamask={() => metamaskService.tryEnablingMetamask()}
        />
      )}
    </>
  );
};

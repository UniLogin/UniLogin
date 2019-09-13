import React from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {UIController} from '../services/UIController';
import {OnboardingModal, useProperty} from '@universal-login/react';

export interface AppProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  uiController: UIController;
  domains: string[];
}

export const App = ({sdk, walletService, uiController, domains}: AppProps) => {
  const showOnboarding = useProperty(uiController.showOnboarding);

  return (
    <>
      {showOnboarding && <OnboardingModal sdk={sdk} walletService={walletService} domains={domains}/>}
    </>
  );
};


import {useProperty} from '../..';
import React from 'react';
import UniversalLoginSDK, {WalletService} from '@unilogin/sdk';
import {ApplicationWallet} from '@unilogin/commons';
import {useHistory} from 'react-router';
import {OnboardingTopUp} from './OnboardingTopUp';
import {OnboardingWaitForDeployment} from './OnboardingWaitForDeployment';

interface OnboardingStepsProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onCreate?: (arg: ApplicationWallet) => void;
  className?: string;
}

export function OnboardingSteps({sdk, walletService, className, onCreate}: OnboardingStepsProps) {
  const walletState = useProperty(walletService.stateProperty);
  const history = useHistory();

  switch (walletState.kind) {
    case 'Future':
      return (
        <OnboardingTopUp
          modalClassName={className}
          walletService={walletService}
          hideModal={async () => {
            walletService.disconnect();
            history.push('/selector');
          }}
          isModal
        />
      );
    case 'Deploying':
      return (
        <OnboardingWaitForDeployment
          walletService={walletService}
          onSuccess={onCreate}
          relayerConfig={sdk.getRelayerConfig()}
          transactionHash={walletState.transactionHash}
        />
      );
    default:
      return null;
  }
}

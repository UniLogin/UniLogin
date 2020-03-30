import {useProperty} from '../..';
import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {ApplicationWallet} from '@unilogin/commons';
import {useHistory} from 'react-router';
import {OnboardingTopUp} from './OnboardingTopUp';
import {OnboardingWaitForDeployment} from './OnboardingWaitForDeployment';

interface OnboardingStepsProps {
  walletService: WalletService;
  onCreate?: (arg: ApplicationWallet) => void;
  className?: string;
}

export function OnboardingSteps({walletService, className, onCreate}: OnboardingStepsProps) {
  const walletState = useProperty(walletService.stateProperty);
  const history = useHistory();

  switch (walletState.kind) {
    case 'Future':
      return (
        <OnboardingTopUp
          modalClassName={className}
          walletService={walletService}
          hideModal={async () => {
            if (confirm('Are you sure you want to leave? You will lose access to this account.')) {
              walletService.disconnect();
              history.push('/selector');
            }
          }}
          isModal
        />
      );
    case 'Deploying':
      return (
        <OnboardingWaitForDeployment
          walletService={walletService}
          onSuccess={onCreate}
          relayerConfig={walletService.sdk.getRelayerConfig()}
          transactionHash={walletState.transactionHash}
        />
      );
    default:
      return null;
  }
}

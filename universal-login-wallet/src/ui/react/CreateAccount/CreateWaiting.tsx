import React from 'react';
import {Redirect} from 'react-router-dom';
import {WalletState} from '@unilogin/sdk';
import {OnboardingWaitForDeployment} from '@unilogin/react';
import {useServices} from '../../hooks';

interface CreateWaitingProps {
  walletState: WalletState;
}

export function CreateWaiting({walletState}: CreateWaitingProps) {
  const {walletService} = useServices();

  if (walletState.kind === 'Deployed' || walletState.kind === 'DeployedWithoutEmail') {
    return <Redirect to='/creationSuccess'/>;
  } else {
    return (
      <div className="main-bg">
        <OnboardingWaitForDeployment
          walletService={walletService}
          relayerConfig={walletService.sdk.getRelayerConfig()}
        />
      </div>
    );
  }
}

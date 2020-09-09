import React from 'react';
import {useHistory} from 'react-router';
import {Onboarding} from '@unilogin/react';
import {useServices, useWalletConfig} from '../hooks';

export const OnboardingScreen = () => {
  const history = useHistory();
  const {walletService} = useServices();
  const walletConfig = useWalletConfig();

  return (
    <div className="main-bg">
      <Onboarding
        walletService={walletService}
        domains={walletConfig.domains}
        emailFlow={true}
        onCreate={() => history.push('/dashboard')}
        onConnect={() => history.push('/dashboard')}
      />
    </div>
  );
};

import React from 'react';
import {useHistory} from 'react-router';
import {OnboardingTopUp} from '@unilogin/react';
import {useServices} from '../../hooks';

export function CreateTopUp() {
  const {walletService} = useServices();
  const history = useHistory();

  return (
    <div className="main-bg">
      <OnboardingTopUp
        walletService={walletService}
        isModal
        hideModal={() => {
          if (confirm('Are you sure you want to leave? You will lose access to this account.')) {
            walletService.disconnect();
            history.push('/selectDeployName');
          }
        }}
      />
    </div>
  );
}

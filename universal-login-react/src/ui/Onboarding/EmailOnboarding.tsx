import React from 'react';
import {Switch} from 'react-router';
import {MemoryRouter, Route} from 'react-router-dom';
import {WalletService} from '@unilogin/sdk';
import {getInitialEmailOnboardingLocation} from '../../app/getInitialOnboardingLocation';
import {EmailFlowChooserScreen} from './EmailFlowChooserScreen';
import {ConfirmCodeScreen} from './ConfirmCodeScreen';

interface EmailOnboardingProps {
  walletService: WalletService;
  hideModal: () => void;
}

export const EmailOnboarding = ({walletService, hideModal}: EmailOnboardingProps) => {
  return <MemoryRouter initialEntries={[getInitialEmailOnboardingLocation(walletService.state)]}>
    <Switch>

    </Switch>
  </MemoryRouter>
  ;
};

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
      <Route
        path='/selector'
        exact
        render={({history}) =>
          <EmailFlowChooserScreen
            walletService={walletService}
            hideModal={hideModal}
            onConnectClick={() => console.log('connect not supported yet!')}
            onCreateClick={async (email, ensName) => {const requestPromise = walletService.createRequestedWallet(email, ensName); history.push('/code'); await requestPromise;}}
          />}/>
      <Route
        path='/code'
        exact
        render={({history}) =>
          <ConfirmCodeScreen
            walletService={walletService}
            hideModal={hideModal}
            onConfirmCode={() => {history.push('/create')}}
          />}/>
    </Switch>
  </MemoryRouter>
  ;
};

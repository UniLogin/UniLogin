import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ApplicationWallet, WalletSuggestionAction} from '@unilogin/commons';
import {ConnectionFlow, ModalWrapper} from '../..';
import {OnboardingSteps} from './OnboardingSteps';
import {Route, MemoryRouter} from 'react-router-dom';
import {Switch} from 'react-router';
import {getInitialOnboardingLocation, getInitialEmailOnboardingLocation} from '../../app/getInitialOnboardingLocation';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import '../styles/themes/Legacy/connectionFlowModalThemeLegacy.sass';
import {ConfirmCodeScreen} from './ConfirmCodeScreen';
import {EmailFlowChooserScreen} from './EmailFlowChooserScreen';

export interface OnboardingProps {
  walletService: WalletService;
  domains: string[];
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  hideModal?: () => void;
  className?: string;
  modalClassName?: string;
  emailFlow?: boolean;
}

export const Onboarding = ({emailFlow = false, ...props}: OnboardingProps) => {
  const onSuccess = () => props.onConnect?.();

  return (
    <MemoryRouter initialEntries={[emailFlow ? getInitialEmailOnboardingLocation(props.walletService.state) : getInitialOnboardingLocation(props.walletService.state)]}>
      <Switch>
        <Route
          exact
          path="/selector"
          render={({history}) =>
            <OnboardingStepsWrapper
              title='Create or connect account'
              description='Type a nickname to create account or your current username to login.'
              contentLabel='Your nickname:'
              hideModal={props.hideModal}
              message={props.walletService.sdk.getNotice()}
              steps={4}
              progress={1}>
              <div className="perspective">
                <WalletSelector
                  sdk={props.walletService.sdk}
                  onCreateClick={async (ensName) => {
                    if (props.walletService.sdk.isRefundPaid()) {
                      await props.walletService.createDeployingWallet(ensName);
                    }
                    history.push('/create', {ensName});
                  }}
                  onConnectClick={(ensName) => history.push('/connectFlow/chooseMethod', {ensName})}
                  domains={props.domains}
                  actions={[WalletSuggestionAction.connect, WalletSuggestionAction.create]}
                />
              </div>
            </OnboardingStepsWrapper>}
        />
        <Route
          path='/email'
          exact
          render={({history}) =>
            <EmailFlowChooserScreen
              domain={props.domains[0]}
              walletService={props.walletService}
              hideModal={props.hideModal}
              onConnectClick={() => console.log('connect not supported yet!')}
              onCreateClick={async (email, ensName) => {const requestPromise = props.walletService.createRequestedWallet(email, ensName); history.push('/code'); await requestPromise;}}
            />}/>
        <Route
          path='/code'
          exact
          render={({history}) =>
            <ConfirmCodeScreen
              walletService={props.walletService}
              hideModal={props.hideModal}
              onConfirmCode={() => {history.push('/create');}}
            />}/>
        <Route
          exact
          path="/create"
          render={({location}) =>
            <OnboardingSteps
              walletService={props.walletService}
              onCreate={props.onCreate}
              ensName={location.state?.ensName}
            />}
        />
        <Route
          path="/connectFlow"
          render={({history, location}) =>
            <ModalWrapper message={props.walletService.sdk.getNotice()} hideModal={() => history.push('/selector')}>
              <ConnectionFlow
                basePath="/connectFlow"
                onCancel={() => history.push('/selector')}
                name={location.state.ensName}
                walletService={props.walletService}
                onSuccess={onSuccess}
              />
            </ModalWrapper>}
        />
      </Switch>
    </MemoryRouter>
  );
};

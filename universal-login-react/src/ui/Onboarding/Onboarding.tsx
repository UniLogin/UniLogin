import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ApplicationWallet, WalletSuggestionAction} from '@unilogin/commons';
import {ConnectionFlow, ModalWrapper} from '../..';
import {OnboardingSteps} from './OnboardingSteps';
import {Route, MemoryRouter, Redirect} from 'react-router-dom';
import {Switch} from 'react-router';
import {getInitialOnboardingLocation, getInitialEmailOnboardingLocation} from '../../app/getInitialOnboardingLocation';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import '../styles/themes/Legacy/connectionFlowModalThemeLegacy.sass';
import {ConfirmCodeScreen} from './ConfirmCodeScreen';
import {EmailFlowChooserScreen} from './EmailFlowChooserScreen';
import {ErrorMessage} from '../commons/ErrorMessage';
import {EnterPassword} from './EnterPassword';
import {getRedirectPathForConfirmCode} from '../../app/getRedirectPathForConfirmCode';

export interface OnboardingProps {
  walletService: WalletService;
  domains: string[];
  onConnect?: () => void;
  onRestore?: () => void;
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
              onConnectClick={async (ensNameOrEmail: string) => {
                try {
                  const waitForCode = props.walletService.createRequestedRestoringWallet(ensNameOrEmail);
                  history.push('/code');
                  await waitForCode;
                } catch (e) {
                  props.walletService.disconnect();
                  history.push('/error', {message: e.message});
                }
              }}
              onCreateClick={async (email: string, ensName: string) => {
                try {
                  const requestPromise = props.walletService.createRequestedCreatingWallet(email, ensName);
                  history.push('/code');
                  await requestPromise;
                } catch (e) {
                  props.walletService.disconnect();
                  history.push('/error', {message: e.message});
                }
              }}
            />} />
        <Route
          path='/code'
          exact
          render={({history}) =>
            <ConfirmCodeScreen
              walletService={props.walletService}
              hideModal={props.hideModal}
              onConfirmCode={() => history.push(getRedirectPathForConfirmCode(props.walletService.state.kind))}
              onCancel={() => {
                props.walletService.disconnect();
                history.push('/email');
              }}
            />} />
        <Route
          path='/restore'
          exact
          render={({history}) =>
            <EnterPassword
              hideModal={props.hideModal}
              walletService={props.walletService}
              onConfirm={async (password: string) => {
                await props.walletService.restoreWallet(password);
                if (props.walletService.isKind('Future')) {
                  history.push('/create');
                } else {
                  props.onRestore?.();
                }
              }}
              onCancel={() => {
                props.walletService.disconnect();
                history.push('/email');
              }}
            />} />
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
        <Route
          path="/error"
          render={({history, location}) =>
            <ModalWrapper message={props.walletService.sdk.getNotice()} hideModal={() => history.push('/')}>
              <ErrorMessage
                title={'Something went wrong'}
                message={location.state.message}
              />
            </ModalWrapper>
          } />
        <Route path="/">
          <Redirect to={emailFlow ? getInitialEmailOnboardingLocation(props.walletService.state) : getInitialOnboardingLocation(props.walletService.state)} />
        </Route>
      </Switch>
    </MemoryRouter>
  );
};

import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ApplicationWallet, WalletSuggestionAction} from '@unilogin/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ConnectionFlow, ModalWrapper} from '../..';
import {OnboardingSteps} from './OnboardingSteps';
import {Route, MemoryRouter} from 'react-router-dom';
import {Switch} from 'react-router';
import {getInitialOnboardingLocation} from '../../app/getInitialOnboardingLocation';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import '../styles/themes/Legacy/connectionFlowModalThemeLegacy.sass';

export interface OnboardingProps {
  walletService: WalletService;
  domains: string[];
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  hideModal?: () => void;
  className?: string;
  modalClassName?: string;
}

export const Onboarding = (props: OnboardingProps) => {
  const onSuccess = () => props.onConnect?.();

  return (
    <div className="universal-login">
      <div className={getStyleForTopLevelComponent(props.className)}>

        <MemoryRouter initialEntries={[getInitialOnboardingLocation(props.walletService.state)]}>
          <Switch>
            <Route
              exact
              path="/selector"
              render={({history}) =>
                <OnboardingStepsWrapper
                  hideModal={props.hideModal}
                  message={props.walletService.sdk.getNotice()}
                  steps={3}
                  progress={1}>
                  <div className="perspective">
                    <WalletSelector
                      sdk={props.walletService.sdk}
                      onCreateClick={async (ensName) => {
                        await props.walletService.createFutureWallet(ensName);
                        history.push('/create');
                      }}
                      onConnectClick={(ensName) => history.push('/connectFlow/chooseMethod', {ensName})}
                      domains={props.domains}
                      actions={[WalletSuggestionAction.connect, WalletSuggestionAction.create]}
                    />
                  </div>
                </OnboardingStepsWrapper>}
            />
            <Route
              exact
              path="/create"
            >
              <OnboardingSteps
                walletService={props.walletService}
                onCreate={props.onCreate}
              />
            </Route>
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
      </div>
    </div>
  );
};

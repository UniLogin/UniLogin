import React from 'react';
import UniversalLoginSDK, {WalletService} from '@unilogin/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ApplicationWallet, WalletSuggestionAction} from '@unilogin/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ConnectionFlow, ModalWrapper} from '../..';
import {OnboardingSteps} from './OnboardingSteps';
import {Route, MemoryRouter} from 'react-router-dom';
import {Switch} from 'react-router';
import {getInitialOnboardingLocation} from '../../app/getInitialOnboardingLocation';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {classForComponent} from '../utils/classFor';
import '../styles/themes/Legacy/connectionFlowModalThemeLegacy.sass';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
  tryEnablingMetamask?: () => Promise<string | undefined>;
  hideModal?: () => void;
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
                  message={props.sdk.getNotice()}
                  steps={5}
                  progress={1}>
                  <div className="perspective">
                    <WalletSelector
                      sdk={props.sdk}
                      onCreateClick={async (ensName) => {
                        await props.walletService.createFutureWallet(ensName);
                        history.push('/create');
                      }}
                      onConnectClick={(ensName) => history.push('/connectFlow/chooseMethod', {ensName})}
                      domains={props.domains}
                      tryEnablingMetamask={props.tryEnablingMetamask}
                      actions={[WalletSuggestionAction.connect, WalletSuggestionAction.create]}
                    />
                  </div>
                </OnboardingStepsWrapper>}
            />
            <Route
              exact
              path="/create"
              render={({history}) =>
                <OnboardingSteps
                  sdk={props.sdk}
                  walletService={props.walletService}
                  onCreate={props.onCreate}
                />}
            />
            <Route
              path="/connectFlow"
              render={({history, location}) =>
                <ModalWrapper message='This is a test environment running on Ropsten network' modalClassName={classForComponent('connection-modal-default-theme')} hideModal={() => history.push('/selector')}>
                  <ConnectionFlow
                    basePath="/connectFlow"
                    onCancel={() => history.push('/selector')}
                    name={location.state.ensName}
                    sdk={props.sdk}
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

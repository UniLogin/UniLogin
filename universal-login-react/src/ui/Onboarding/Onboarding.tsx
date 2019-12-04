import React, {useEffect, useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import {ApplicationWallet, WalletSuggestionAction} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {WalletCreationService, ConnectionFlow, ModalWrapper} from '../..';
import {OnboardingSteps} from './OnboardingSteps';
import {Route, MemoryRouter} from 'react-router-dom';
import {Switch} from 'react-router';

export interface OnboardingProps {
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  walletCreationService?: WalletCreationService;
  onConnect?: () => void;
  onCreate?: (arg: ApplicationWallet) => void;
  domains: string[];
  className?: string;
  modalClassName?: string;
  tryEnablingMetamask?: () => Promise<string | undefined>;
}

export const Onboarding = (props: OnboardingProps) => {
  const [walletCreationService] = useState(() => props.walletCreationService || new WalletCreationService(props.walletService));

  const onSuccess = () => props.onConnect?.();

  const onCreateClick = (ensName: string) => {
    props.walletService.createFutureWallet(ensName);
  }

  useEffect(() => {
    setImmediate(async () => {
      const wallet = await walletCreationService.deployWhenReady();
      props.onCreate?.(wallet);
    });
  }, []);

  return (
    <div className="universal-login">
      <div className={getStyleForTopLevelComponent(props.className)}>

        <MemoryRouter initialEntries={['/selector']}>
          <Switch>
            <Route
              exact
              path="/selector"
              render={({history}) =>
                <>
                  <div className="perspective">
                    <WalletSelector
                      sdk={props.sdk}
                      onCreateClick={onCreateClick}
                      onConnectClick={(ensName) => history.push('/connectFlow', {ensName})}
                      domains={props.domains}
                      tryEnablingMetamask={props.tryEnablingMetamask}
                      actions={[WalletSuggestionAction.connect, WalletSuggestionAction.create]}
                    />
                  </div>
                  <OnboardingSteps
                    sdk={props.sdk}
                    walletService={props.walletService}
                    walletCreationService={walletCreationService}
                  />
                </>}
            />
            <Route
              exact
              path="/connectFlow"
              render={({history, location}) =>
                <ModalWrapper hideModal={() => history.goBack()}>
                  <ConnectionFlow
                    onCancel={() => history.goBack()}
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

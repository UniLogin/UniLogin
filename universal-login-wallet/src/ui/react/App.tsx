import React, {useLayoutEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import {createModalService, useProperty} from '@universal-login/react';
import HomeScreen from './Home/HomeScreen';
import TransferringFundsScreen from './Login/TransferringFundsScreen';
import NotFound from './NotFound';
import {PrivateRoute} from './PrivateRoute';
import ApproveScreen from './Login/ApproveScreen';
import RecoveryScreen from './Login/RecoveryScreen';
import SettingsScreen from './Settings/SettingsScreen';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {WalletModalContext, WalletModalType} from '../../core/entities/WalletModalContext';
import {PublicRelayerConfig} from '@universal-login/commons';

interface App {
  relayerConfig?: PublicRelayerConfig;
}

const App = ({relayerConfig}: App) => {
  const modalService = createModalService<WalletModalType, string>();
  const {walletService} = useServices();
  const [appReady, setAppReady] = useState(false);

  useLayoutEffect(() => {
    if (walletService.state.kind === 'None') {
      walletService.loadFromStorage();
    }
    setAppReady(true);
  }, []);

  const authorized = useProperty(walletService.isAuthorized);

  if (!appReady) {
    return null;
  }

  return (
    <WalletModalContext.Provider value={modalService}>
      <Switch>
        <Route
          exact
          path="/welcome"
          render={() => <WelcomeScreen />}
        />
        <Route
          exact
          path="/terms"
          render={() => <TermsAndConditionsScreen />}
        />
        <Route
          exact
          path="/create"
          render={() => <CreateAccount relayerConfig={relayerConfig} />}
        />
        <Route
          exact
          path="/connect"
          render={() => <ConnectAccount />}
        />
        <Route
          exact
          path="/approve"
          render={() => <ApproveScreen />}
        />
        <Route
          exact
          path="/recovery"
          render={() => <RecoveryScreen />}
        />
        <PrivateRoute
          authorized={authorized}
          exact
          path="/"
          render={() => <HomeScreen />}
        />
        <PrivateRoute
          path="/transferring"
          authorized={authorized}
          render={() => <TransferringFundsScreen />}
        />
        <PrivateRoute
          path="/settings"
          authorized={authorized}
          render={() => <SettingsScreen />}
        />
        <Route component={NotFound} />
      </Switch>
    </WalletModalContext.Provider>
  );
};

export default App;

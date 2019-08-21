import React, { useLayoutEffect, useState } from 'react';
import {Route, Switch} from 'react-router-dom';
import {createModalService} from '@universal-login/react';
import HomeScreen from './Home/HomeScreen';
import TransferringFundsScreen from './Login/TransferringFundsScreen';
import NotFound from './NotFound';
import {PrivateRoute} from './PrivateRoute';
import ApproveScreen from './Login/ApproveScreen';
import RecoveryScreen from './Login/RecoveryScreen';
import SettingsScreen from './Settings/SettingsScreen';
import {useServices, useRouter} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {WalletModalContext, WalletModalType} from '../../core/entities/WalletModalContext';
import {ConnectionNotificationScreen} from './ConnectAccount/ConnectionNotificationScreen';

const App = () => {
  const {history} = useRouter();
  const modalService = createModalService<WalletModalType, void>();
  const {walletService, walletStorageService, sdk} = useServices();
  const [appReady, setAppReady] = useState(false);

  useLayoutEffect(() => {
    walletStorageService.load();
    setAppReady(true);
  }, []);

  if (!appReady) {
    return null;
  }

  const authorized = walletService.isAuthorized();

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
          render={props => <CreateAccount {...props} />}
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
          path="/notifications"
          authorized={authorized}
          render={() => <ConnectionNotificationScreen
            contractAddress={walletService.applicationWallet!.contractAddress}
            privateKey={walletService.applicationWallet!.privateKey}
            onCancel={() => history.push('/')}
            sdk={sdk}
          />}
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

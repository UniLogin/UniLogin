import React from 'react';
import {Route, Switch} from 'react-router-dom';
import HomeScreen from './Home/HomeScreen';
import TransferringFundsScreen from './Login/TransferringFundsScreen';
import NotFound from './NotFound';
import Login from './Login/Login';
import {PrivateRoute} from './PrivateRoute';
import NotificationsScreen from './NotificationsScreen';
import ApproveScreen from './Login/ApproveScreen';
import RecoveryScreen from './Login/RecoveryScreen';
import SettingsScreen from './Settings/SettingsScreen';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {useModal} from '../hooks/useModal';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {ChooseConnectionMethod} from './ConnectAccount/ChooseConnectionMethod';
import {ConnectWithPassphrase} from './ConnectAccount/ConnectWithPassphrase';
import {ConnectWithEmoji} from './ConnectAccount/ConnectWithEmoji';

const App = () => {
  const modalService = useModal();
  const {walletService} = useServices();
  const authorized = walletService.isAuthorized();

  return (
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
        render={props => <CreateAccount {...props} modalService={modalService} />}
      />
      <Route
        exact
        path="/connect"
        render={props =>
          <ConnectAccount {...props} />
        }
      />
      <Route
        exact
        path="/choose-connection"
        render={props =>
          <ChooseConnectionMethod {...props} />
        }
      />
      <Route
        exact
        path="/connect-with-passphrase"
        render={props =>
          <ConnectWithPassphrase />
        }
      />
      <Route
        exact
        path="/connect-with-emoji"
        render={props =>
          <ConnectWithEmoji />
        }
      />
      <Route
        exact
        path="/login"
        render={props => <Login {...props} modalService={modalService} />}
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
        render={() => <HomeScreen modalService={modalService} />}
      />
      <PrivateRoute
        path="/transferring"
        authorized={authorized}
        render={() => <TransferringFundsScreen />}
      />
      <PrivateRoute
        path="/notifications"
        authorized={authorized}
        render={() => <NotificationsScreen />}
      />
      <PrivateRoute
        path="/settings"
        authorized={authorized}
        render={() => <SettingsScreen />}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;

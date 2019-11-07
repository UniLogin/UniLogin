import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {useModalService, useProperty} from '@universal-login/react';
import HomeScreen from './Home/HomeScreen';
import NotFound from './NotFound';
import {PrivateRoute} from './PrivateRoute';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {WalletModalContext, WalletModalPropType, WalletModalType} from '../../core/entities/WalletModalContext';
import {PrivacyPolicy} from './Home/PrivacyPolicy';
import {CreateFlow} from './CreateAccount/CreateFlow';

const App = () => {
  const modalService = useModalService<WalletModalType, WalletModalPropType>();
  const {walletService} = useServices();
  const authorized = useProperty(walletService.isAuthorized);

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
          path="/privacy"
          target="_blank"
          render={() => <PrivacyPolicy />}
        />
        <Route
          exact
          path="/create"
          render={() => <CreateFlow />}
        />
        <Route
          exact
          path="/connect"
          render={() =>
            <div className="main-bg">
              <div className="box-wrapper">
                <div className="box">
                  <ConnectAccount />
                </div>
              </div>
            </div>}
        />
        <PrivateRoute
          authorized={authorized}
          path="/"
          render={() => <HomeScreen />}
        />
        <Route component={NotFound} />
      </Switch>
    </WalletModalContext.Provider>
  );
};

export default App;

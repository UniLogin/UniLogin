import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {useProperty} from '@universal-login/react';
import HomeScreen from './Home/HomeScreen';
import NotFound from './NotFound';
import {PrivateRoute} from './PrivateRoute';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {PrivacyPolicy} from './Home/PrivacyPolicy';
import {CreateFlow} from './CreateAccount/CreateFlow';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {ConnectionSuccess, CreationSuccess} from './Modals/ModalTxnSuccess';

const App = () => {
  const {walletService} = useServices();
  const authorized = useProperty(walletService.isAuthorized);

  return (
    <Switch>
      <Route exact path="/welcome" component={WelcomeScreen} />
      <Route exact path="/terms" component={TermsAndConditionsScreen} />
      <Route exact path="/privacy" component={PrivacyPolicy} />
      <Route exact path="/create" component={CreateFlow} />
      <Route exact path="/connectionSucceed" component={ConnectionSuccess} />
      <Route exact path="/creationSucceed" component={CreationSuccess} />
      <Route
        exact
        path="/selectDeployName"
        render={({history}) =>
          <CreateAccount onCreateClick={async (ensName) => {
            await walletService.createFutureWallet(ensName);
            history.push('/create');
          }} />}
      />
      <Route
        exact
        path="/connect" >
        <div className="main-bg">
          <div className="box-wrapper">
            <div className="box">
              <ConnectAccount />
            </div>
          </div>
        </div>
      </Route>
      <PrivateRoute
        authorized={authorized}
        path="/"
        render={() => <HomeScreen />}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;

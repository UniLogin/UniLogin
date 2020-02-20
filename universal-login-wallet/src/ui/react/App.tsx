import React from 'react';
import {Switch} from 'react-router-dom';
import {useProperty} from '@unilogin/react';
import HomeScreen from './Home/HomeScreen';
import NotFound from './NotFound';
import {WalletRoute} from './WalletRoute';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';
import {PrivacyPolicy} from './Home/PrivacyPolicy';
import {CreateTopUp} from './CreateAccount/CreateTopUp';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {ConnectionSuccess, CreationSuccess} from './Modals/ModalTxnSuccess';
import {CreateWaiting} from './CreateAccount/CreateWaiting';

const App = () => {
  const {walletService} = useServices();
  const walletState = useProperty(walletService.stateProperty);

  return (
    <Switch>
      <WalletRoute exact walletState={walletState} path="/welcome" component={WelcomeScreen} />
      <WalletRoute exact walletState={walletState} path="/terms" component={TermsAndConditionsScreen} />
      <WalletRoute exact walletState={walletState} path="/privacy" component={PrivacyPolicy} />
      <WalletRoute exact walletState={walletState} path="/create/waiting" component={CreateWaiting} />
      <WalletRoute exact walletState={walletState} path="/create/topUp" component={CreateTopUp} />
      <WalletRoute exact walletState={walletState} path="/connectionSuccess" component={ConnectionSuccess} />
      <WalletRoute exact walletState={walletState} path="/creationSuccess" component={CreationSuccess} />
      <WalletRoute exact walletState={walletState} path="/selectDeployName" component={CreateAccount} />
      <WalletRoute walletState={walletState} path="/connect" component={ConnectAccount} />
      <WalletRoute walletState={walletState} path="/wallet" component={HomeScreen} />
      <WalletRoute walletState={walletState} component={NotFound} />
    </Switch>
  );
};

export default App;

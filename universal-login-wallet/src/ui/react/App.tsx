import React from 'react';
import {Switch} from 'react-router-dom';
import HomeScreen from './Home/HomeScreen';
import NotFound from './NotFound';
import {WalletRoute} from './WalletRoute';
import {useServices} from '../hooks';
import {WelcomeScreen} from './Home/WelcomeScreen';
import {TermsAndConditionsScreen} from './Home/TermsAndConditionsScreen';
import {PrivacyPolicy} from './Home/PrivacyPolicy';
import {Wallet} from './Wallet';
import {OnboardingRoutes} from './OnboardingRoutes';

const App = () => {
  const {walletService} = useServices();

  return (
    <Switch>
      <WalletRoute exact walletService={walletService} path="/welcome" component={WelcomeScreen} />
      <WalletRoute exact walletService={walletService} path="/terms" component={TermsAndConditionsScreen} />
      <WalletRoute exact walletService={walletService} path="/privacy" component={PrivacyPolicy} />
      <WalletRoute walletService={walletService} path="/dashboard" component={HomeScreen} />
      <WalletRoute walletService={walletService} path="/debugStorage" component={Wallet} />
      <OnboardingRoutes walletService={walletService} />
      <WalletRoute walletService={walletService} component={NotFound} />
    </Switch>
  );
};

export default App;

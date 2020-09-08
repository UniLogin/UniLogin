import React from 'react';
import {useProperty} from '@unilogin/react';
import {WalletService} from '@unilogin/sdk';
import {WalletRoute} from './WalletRoute';
import {CreateWaiting} from './CreateAccount/CreateWaiting';
import {CreateTopUp} from './CreateAccount/CreateTopUp';
import {ConnectionSuccess, CreationSuccess} from './Modals/ModalTxnSuccess';
import {CreateAccount} from './CreateAccount/CreateAccount';
import {ConnectAccount} from './ConnectAccount/ConnectAccount';

export interface OnboardingRoutesProps {
  walletService: WalletService;
}

export const OnboardingRoutes = ({walletService}: OnboardingRoutesProps) => {
  useProperty(walletService.stateProperty);

  return (<>
    <WalletRoute exact walletService={walletService} path="/create/waiting" component={CreateWaiting} />
    <WalletRoute exact walletService={walletService} path="/create/topUp" component={CreateTopUp} />
    <WalletRoute exact walletService={walletService} path="/connectionSuccess" component={ConnectionSuccess} />
    <WalletRoute exact walletService={walletService} path="/creationSuccess" component={CreationSuccess} />
    <WalletRoute exact walletService={walletService} path="/selectDeployName" component={CreateAccount} />
    <WalletRoute walletService={walletService} path="/connect" component={ConnectAccount} />
  </>);
};

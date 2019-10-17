import React from 'react';
import {Route, Switch} from 'react-router';
import {DevicesList} from './DevicesList';
import {WalletService} from '@universal-login/sdk';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DeleteAccount} from '../DeleteAccount';
import {ConnectionSuccessNotification} from '../../Notifications/ConnectionSuccessNotification';

export interface DevicesProps {
  walletService: WalletService;
  basePath?: string;
  className?: string;
}

export const Devices = ({walletService, className, basePath = ''}: DevicesProps) => {
  const deployedWallet = walletService.getDeployedWallet();
  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <DevicesList deployedWallet={deployedWallet} className={className}/>
      </Route>
      <Route path={`${basePath}/approveDevice`} exact>
        <ConnectionNotification deployedWallet={deployedWallet} className={className}/>
      </Route>
      <Route path={`${basePath}/connectionSuccess`} exact>
        <ConnectionSuccessNotification className={className}/>
      </Route>
      <Route
        path={`${basePath}/`}
        exact
        render={({history}) => (
          <DeleteAccount
            walletService={walletService}
            onCancelClick={() => history.replace(`${basePath}/`)}
            onConfirmDeleteClick={() => {}}
            className={className}
          />
        )}
      />
    </Switch>
  );
};

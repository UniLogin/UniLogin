import React from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {DevicesList} from './DevicesList';
import {WalletService} from '@universal-login/sdk';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DeleteAccount} from '../DeleteAccount';
import {ConnectionSuccessNotification} from '../../Notifications/ConnectionSuccessNotification';
import {WaitingFor} from '../../commons/WaitingFor';

export interface DevicesProps {
  walletService: WalletService;
  onAccountDeleted: () => void;
  basePath?: string;
  className?: string;
}

export const Devices = ({walletService, onAccountDeleted, className, basePath = ''}: DevicesProps) => {
  const deployedWallet = walletService.getDeployedWallet();
  const history = useHistory();

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <DevicesList
          deployedWallet={deployedWallet}
          devicesBasePath={basePath}
          className={className}
        />
      </Route>
      <Route path={`${basePath}/approveDevice`} exact>
        <ConnectionNotification
          deployedWallet={deployedWallet}
          devicesBasePath={basePath}
          className={className}
        />
      </Route>
      <Route path={`${basePath}/connectionSuccess`} exact>
        <ConnectionSuccessNotification className={className}/>
      </Route>
      <Route path={`${basePath}/deleteAccount`} exact>
        <DeleteAccount
          walletService={walletService}
          onAccountDeleted={onAccountDeleted}
          onCancelClick={() => history.replace(`${basePath}/`)}
          className={className}
        />
      </Route>
      <Route path={`${basePath}/waitingForDeleteAccount`} exact>
        <WaitingFor action={'Deleting account'} className={className} />
      </Route>
    </Switch>
  );
};

import React from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {join} from 'path';
import {WalletService} from '@universal-login/sdk';
import {DevicesList} from './DevicesList';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DisconnectAccount} from '../DisconnectAccount';
import {ConnectionSuccessNotification} from '../../Notifications/ConnectionSuccessNotification';
import {WaitingForTransaction} from '../../commons/WaitingForTransaction';
import {ErrorMessage} from '../../commons/ErrorMessage';

export interface DevicesProps {
  walletService: WalletService;
  onAccountDisconnected: () => void;
  basePath?: string;
  className?: string;
}

export const Devices = ({walletService, onAccountDisconnected, className, basePath = ''}: DevicesProps) => {
  const deployedWallet = walletService.getDeployedWallet();
  const relayerConfig = walletService.sdk.getRelayerConfig();
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
      <Route path={join(basePath, 'approveDevice')} exact>
        <ConnectionNotification
          deployedWallet={deployedWallet}
          devicesBasePath={basePath}
          className={className}
        />
      </Route>
      <Route path={join(basePath, 'connectionSuccess')} exact>
        <ConnectionSuccessNotification className={className} />
      </Route>
      <Route path={join(basePath, 'connectionFailed')} exact>
        <ErrorMessage className={className} />
      </Route>
      <Route path={join(basePath, 'disconnectAccount')} exact>
        <DisconnectAccount
          walletService={walletService}
          onDisconnectProgress={transactionHash => history.replace(join(basePath, 'waitingForDeletingAccount'), {transactionHash})}
          onAccountDisconnected={onAccountDisconnected}
          onCancelClick={() => history.replace(`${basePath}/`)}
          className={className}
        />
      </Route>
      <Route path={join(basePath, 'waitingForRemovingDevice')} exact>
        <WaitingForTransaction action="Removing device" relayerConfig={relayerConfig} className={className} />
      </Route>
      <Route path={join(basePath, 'waitingForDeletingAccount')} exact>
        <WaitingForTransaction action="Deleting account" relayerConfig={relayerConfig} className={className}/>
      </Route>
      <Route path={join(basePath, 'waitingForConnection')} exact>
        <WaitingForTransaction action="Connecting device" relayerConfig={relayerConfig} className={className} />
      </Route>
    </Switch>
  );
};

import React from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {join} from 'path';
import {WalletService} from '@unilogin/sdk';
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
}

export const Devices = ({walletService, onAccountDisconnected, basePath = ''}: DevicesProps) => {
  const deployedWallet = walletService.getDeployedWallet();
  const relayerConfig = walletService.sdk.getRelayerConfig();
  const history = useHistory();

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <DevicesList
          deployedWallet={deployedWallet}
          devicesBasePath={basePath}
        />
      </Route>
      <Route path={join(basePath, 'approveDevice')} exact>
        <ConnectionNotification
          deployedWallet={deployedWallet}
          devicesBasePath={basePath}
        />
      </Route>
      <Route path={join(basePath, 'connectionSuccess')} exact>
        <ConnectionSuccessNotification basePath={basePath} />
      </Route>
      <Route
        path={join(basePath, 'connectionFailed')}
        exact
        render={({location}) =>
          <ErrorMessage
            title={'Connecting device failed'}
            message={location.state?.error}
          /> }
      />
      <Route path={join(basePath, 'disconnectAccount')} exact>
        <DisconnectAccount
          walletService={walletService}
          onDisconnectProgress={transactionHash => history.replace(join(basePath, 'waitingForDeletingAccount'), {transactionHash})}
          onAccountDisconnected={onAccountDisconnected}
          onCancelClick={() => history.replace(`${basePath}/`)}
        />
      </Route>
      <Route
        path={join(basePath, 'waitingForRemovingDevice')}
        exact
        render={({location}) => <WaitingForTransaction action="Removing device" relayerConfig={relayerConfig} transactionHash={location.state?.transactionHash} />}
      />
      <Route
        path={join(basePath, 'waitingForDeletingAccount')}
        exact
        render={({location}) => <WaitingForTransaction action="Deleting account" relayerConfig={relayerConfig} transactionHash={location.state?.transactionHash} />}
      />
      <Route
        path={join(basePath, 'waitingForConnection')}
        exact
        render={({location}) => <WaitingForTransaction action="Connecting device" relayerConfig={relayerConfig} transactionHash={location.state?.transactionHash} />}
      />
    </Switch>
  );
};

import React, {useState} from 'react';
import {DevicesList} from './DevicesList';
import {DeployedWallet} from '@universal-login/sdk';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DeleteAccount} from '../DeleteAccount';
import {ConnectionSuccessNotification} from '../../Notifications/ConnectionSuccessNotification';
import {Route, Switch} from 'react-router';

export interface DevicesProps {
  deployedWallet: DeployedWallet;
  basePath?: string;
  className?: string;
}

export type devicesContentType = 'devices' | 'approveDevice' | 'deleteAccount' | 'connectionSuccess';

export const Devices = ({deployedWallet, className, basePath = ''}: DevicesProps) => {
  return (
    <Switch>
      <Route
        path={`${basePath}/`}
        exact
        render={({history}) => (
          <DevicesList
            deployedWallet={deployedWallet}
            className={className}
            setDevicesContent={content => history.replace(`${basePath}/${content}`)}
          />
        )}
      />
      <Route
        path={`${basePath}/approveDevice`}
        exact
        render={({history}) => (
          <ConnectionNotification
            onConnectionSuccess={() => history.replace(`${basePath}/connectionSuccess`)}
            deployedWallet={deployedWallet}
            onDenyRequests={() => history.replace(`${basePath}/`)}
            className={className}
          />
        )}
      />
      <Route
        path={`${basePath}/connectionSuccess`}
        exact
        render={({history}) => (
          <ConnectionSuccessNotification onClose={() => history.replace(`${basePath}/`)} className={className}/>
        )}
      />
      <Route
        path={`${basePath}/`}
        exact
        render={({history}) => (
          <DeleteAccount
            onCancelClick={() => history.replace(`${basePath}/`)}
            onConfirmDeleteClick={() => {
            }}
            className={className}
          />
        )}
      />
    </Switch>
  );
};

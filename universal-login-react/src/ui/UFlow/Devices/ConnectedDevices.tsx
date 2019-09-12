import React from 'react';
import {Device} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';
import {ConfirmationsEdit} from './ConfirmationsEdit';

export interface ConnectedDevicesProps {
  devicesList: Device[];
  deployedWallet: DeployedWallet;
}

export const ConnectedDevices = ({devicesList, deployedWallet}: ConnectedDevicesProps) => {
  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
        <ConfirmationsEdit deployedWallet={deployedWallet} devicesAmount={devicesList.length}/>
      </div>
      <ul className="connected-devices-list">
        {devicesList.map((device, index) => {
          return (
            <ConnectedDevicesItem
              key={index}
              devicesAmount={devicesList.length}
              {...device}
            />
          );
        })}
      </ul>
    </div>
  );
};

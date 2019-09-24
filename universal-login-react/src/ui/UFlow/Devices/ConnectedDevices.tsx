import React, {useState} from 'react';
import {Device} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';
import {ConfirmationsEdit} from './ConfirmationsEdit';

export interface ConnectedDevicesProps {
  devicesList: Device[];
  deployedWallet: DeployedWallet;
}

export const ConnectedDevices = ({devicesList, deployedWallet}: ConnectedDevicesProps) => {
  const [confirmationsCount, setConfirmationsCount] = useState<string>('');

  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
        <ConfirmationsEdit
          confirmationsCount={confirmationsCount}
          setConfirmationsCount={confirmations => setConfirmationsCount(confirmations)}
          deployedWallet={deployedWallet}
          devicesAmount={devicesList.length}
        />
      </div>
      <ul className="connected-devices-list">
        {devicesList.map(device => {
          return (
            <ConnectedDevicesItem
              key={device.publicKey}
              confirmationsCount={confirmationsCount}
              devicesAmount={devicesList.length}
              deployedWallet={deployedWallet}
              {...device}
            />
          );
        })}
      </ul>
    </div>
  );
};

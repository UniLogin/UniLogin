import React from 'react';
import {Device} from '@universal-login/commons';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';
import {ConfirmationsEdit} from './ConfirmationsEdit';

export interface ConnectedDevicesProps {
  devicesList: Device[];
  deployedWallet: DeployedWallet;
  sdk: UniversalLoginSDK;
  privateKey: string;
}

export const ConnectedDevices = ({devicesList, deployedWallet, sdk, privateKey}: ConnectedDevicesProps) => {
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
              key={device.publicKey}
              devicesAmount={devicesList.length}
              sdk={sdk}
              privateKey={privateKey}
              {...device}
            />
          );
        })}
      </ul>
    </div>
  );
};

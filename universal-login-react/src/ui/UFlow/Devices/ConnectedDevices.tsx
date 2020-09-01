import React, {useState} from 'react';
import {Device} from '@unilogin/commons';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {ConnectedDevice} from './ConnectedDevice';
import {ConfirmationsEdit} from './ConfirmationsEdit';
import {FeatureFlag} from '../../commons/FeatureFlag';

export interface ConnectedDevicesProps {
  devicesList: Device[];
  deployedWallet: DeployedWithoutEmailWallet;
  setDeviceToRemove: (arg: string | undefined) => void;
}

export const ConnectedDevices = ({devicesList, deployedWallet, setDeviceToRemove}: ConnectedDevicesProps) => {
  const [confirmationsCount, setConfirmationsCount] = useState<string>('');

  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
        <FeatureFlag sdk={deployedWallet.sdk} feature="requiredConfirmations">
          <ConfirmationsEdit
            confirmationsCount={confirmationsCount}
            setConfirmationsCount={confirmations => setConfirmationsCount(confirmations)}
            deployedWallet={deployedWallet}
            devicesAmount={devicesList.length}
          />
        </FeatureFlag>
      </div>
      <ul className="connected-devices-list">
        {devicesList.map(device => {
          return (
            <ConnectedDevice
              setDeviceToRemove={setDeviceToRemove}
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

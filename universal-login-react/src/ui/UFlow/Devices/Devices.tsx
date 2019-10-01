import React, {useState} from 'react';
import {DevicesList} from './DevicesList';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DeleteAccount} from '../DeleteAccount';

export interface DevicesProps {
  sdk: UniversalLoginSDK;
  deployedWallet: DeployedWallet;
  className?: string;
}

export type devicesContentType = 'devices' | 'approveDevice' | 'deleteAccount';

export const Devices = ({sdk, deployedWallet, className}: DevicesProps) => {
  const [devicesContent, setDevicesContent] = useState<devicesContentType>('devices');

  switch (devicesContent) {
    case 'devices':
      return (
        <DevicesList
          sdk={sdk}
          deployedWallet={deployedWallet}
          className={className}
          setDevicesContent={content => setDevicesContent(content)}
        />
      );
    case 'approveDevice':
      return (
        <ConnectionNotification
          onConnectionSuccess={() => setDevicesContent('devices')}
          deployedWallet={deployedWallet}
          onDenyRequests={() => setDevicesContent('devices')}
          className={className}
        />
      );
    case 'deleteAccount':
      return (
        <DeleteAccount
          onCancelClick={() => setDevicesContent('devices')}
          onConfirmDeleteClick={() => {}}
          className={className}
        />
      );
    default:
      return null;
  }
};

import React, {useState} from 'react';
import {DevicesList} from './DevicesList';
import {DeployedWallet} from '@universal-login/sdk';
import {ConnectionNotification} from '../../Notifications/ConnectionNotification';
import {DeleteAccount} from '../DeleteAccount';

export interface DevicesProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export type devicesContentType = 'devices' | 'approveDevice' | 'deleteAccount';

export const Devices = ({deployedWallet, className}: DevicesProps) => {
  const [devicesContent, setDevicesContent] = useState<devicesContentType>('devices');

  switch (devicesContent) {
    case 'devices':
      return (
        <DevicesList
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

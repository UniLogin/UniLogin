import React, {useState, useEffect} from 'react';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import './../../styles/devices.sass';
import './../../styles/devicesDefault.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';

export interface DevicesProps {
  sdk: UniversalLoginSDK;
  className?: string;
  contractAddress: string;
  privateKey: string;
  ensName: string;
  onManageDevicesClick: () => void;
}

export const Devices = ({sdk, contractAddress, privateKey, ensName, className, onManageDevicesClick}: DevicesProps) => {
  const deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNotifications), []);

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          {notifications.length > 0 && <NewDeviceMessage onClick={onManageDevicesClick}/>}
          {devices ?
            <ConnectedDevices
              devicesList={devices}
              deployedWallet={deployedWallet}
            /> : 'Loading devices..'
          }
        </div>
      </div>
    </div>
  );
};

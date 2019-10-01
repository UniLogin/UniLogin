import React, {useState, useEffect} from 'react';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import './../../styles/devices.sass';
import './../../styles/devicesDefault.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';
import {devicesContentType} from './Devices';
import {FeatureFlag} from '../../commons/FeatureFlag';

export interface DevicesListProps {
  sdk: UniversalLoginSDK;
  deployedWallet: DeployedWallet;
  className?: string;
  setDevicesContent: (content: devicesContentType) => void;
}

export const DevicesList = ({sdk, setDevicesContent, deployedWallet, className}: DevicesListProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          <div className="devices-inner">
            {notifications.length > 0 && <NewDeviceMessage onClick={() => setDevicesContent('approveDevice')}/>}
            {devices ?
              <ConnectedDevices
                devicesList={devices}
                deployedWallet={deployedWallet}
              /> : 'Loading devices..'
            }
          </div>
          <FeatureFlag sdk={sdk} feature="deleteAccount">
            <button onClick={() => setDevicesContent('deleteAccount')} className="delete-account-link">Delete account</button>
          </FeatureFlag>
        </div>
      </div>
    </div>
  );
};

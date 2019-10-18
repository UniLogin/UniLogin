import React, {useState, useEffect} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import './../../styles/devices.sass';
import './../../styles/devicesDefault.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';
import {FeatureFlag} from '../../commons/FeatureFlag';
import Spinner from '../../commons/Spinner';
import {useHistory} from 'react-router';

export interface DevicesListProps {
  deployedWallet: DeployedWallet;
  className?: string;
}

export const DevicesList = ({deployedWallet, className}: DevicesListProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  const [notifications, setNotifications] = useState([] as Notification[]);
  useEffect(() => deployedWallet.subscribeAuthorisations(setNotifications), []);

  const history = useHistory();

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          <div className="devices-inner">
            {notifications.length > 0 && <NewDeviceMessage onClick={() => history.push('approveDevice')}/>}
            {devices ?
              <ConnectedDevices
                devicesList={devices}
                deployedWallet={deployedWallet}
              />
              : <Spinner className="spinner-center"/>}
          </div>
          <FeatureFlag sdk={deployedWallet.sdk} feature="deleteAccount">
            <button onClick={() => history.push('deleteAccount')} className="delete-account-link">Delete account</button>
          </FeatureFlag>
        </div>
      </div>
    </div>
  );
};

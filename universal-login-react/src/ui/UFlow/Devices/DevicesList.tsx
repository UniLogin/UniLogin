import React from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import './../../styles/devices.sass';
import './../../styles/devicesDefault.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';
import Spinner from '../../commons/Spinner';
import {useHistory} from 'react-router';
import {join} from 'path';

export interface DevicesListProps {
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  className?: string;
}

export const DevicesList = ({deployedWallet, devicesBasePath, className}: DevicesListProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  const history = useHistory();

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          <NewDeviceMessage
            deployedWallet={deployedWallet}
            onManageClick={() => history.push(join(devicesBasePath, 'approveDevice'))}
            className={className}
          />
          <div className="devices-inner">
            {devices
              ? <ConnectedDevices
                devicesList={devices}
                deployedWallet={deployedWallet}
                devicesBasePath={devicesBasePath}
              />
              : <Spinner className="spinner-center"/>}
          </div>
          <button onClick={() => history.push(join(devicesBasePath, 'deleteAccount'))} className="disconnect-account-link">Disconnect this device</button>
        </div>
      </div>
    </div>
  );
};

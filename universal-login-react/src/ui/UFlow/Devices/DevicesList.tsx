import React from 'react';
import {DeployedWallet} from '@unilogin/sdk';
import './../../styles/devices.sass';
import './../../styles/themes/Legacy/devicesThemeLegacy.sass';
import './../../styles/themes/UniLogin/devicesThemeUniLogin.sass';
import './../../styles/themes/Jarvis/devicesThemeJarvis.sass';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';
import Spinner from '../../commons/Spinner';
import {useHistory} from 'react-router';
import {join} from 'path';
import {ThemedComponent} from '../../commons/ThemedComponent';

export interface DevicesListProps {
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  className?: string;
}

export const DevicesList = ({deployedWallet, devicesBasePath, className}: DevicesListProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);

  const history = useHistory();

  return (
    <ThemedComponent name="devices">
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
      <button onClick={() => history.push(join(devicesBasePath, 'disconnectAccount'))} className="disconnect-account-link">Disconnect this device</button>
    </ThemedComponent>
  );
};

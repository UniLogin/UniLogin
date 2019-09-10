import React, {useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
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
}

export const Devices = ({sdk, contractAddress, privateKey, className}: DevicesProps) => {
  const [newDevicesAmount] = useState(1);
  const [devices] = useAsync(async () => sdk.getConnectedDevices(contractAddress, privateKey), []);

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          {newDevicesAmount > 0 && <NewDeviceMessage onClick={() => {}} />}
          {devices ? <ConnectedDevices devicesList={devices} /> : 'Loading devices..'}
        </div>
      </div>
    </div>
  );
};

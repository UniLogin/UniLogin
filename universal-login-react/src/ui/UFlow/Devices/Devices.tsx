import React, {useState} from 'react';
import './../../styles/devices.sass';
import './../../styles/devicesDefault.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';

export interface DevicesProps {
  className?: string;
}

export const Devices = ({className}: DevicesProps) => {
  const [newDevicesAmount] = useState(1);
  const [connectedDevices] = useState(devicesList);

  return (
    <div className="universal-login-devices">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="devices">
          {newDevicesAmount > 0 && <NewDeviceMessage onClick={() => {}} />}
          <ConnectedDevices devicesList={connectedDevices} />
        </div>
      </div>
    </div>
  );
};

const devicesList = [
  {
    os: 'Mac',
    name: 'laptop',
    city: 'Warsaw, Poland',
    ipAddress: '84.10.249.134',
    time: '18 minutes ago',
    browser: 'Safari'
  },
  {
    os: 'iPhone',
    name: 'phone',
    city: 'Warsaw, Poland',
    ipAddress: '84.10.249.134',
    time: '18 minutes ago',
    browser: 'Safari'
  },
  {
    os: 'iPad Air',
    name: 'tablet',
    city: 'Warsaw, Poland',
    ipAddress: '84.10.249.134',
    time: '18 minutes ago',
    browser: 'Safari'
  }
];

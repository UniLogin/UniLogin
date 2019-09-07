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
    device: 'Mac',
    type: 'laptop',
    location: 'Warsaw, Poland',
    ip: '84.10.249.134'
  },
  {
    device: 'iPhone',
    type: 'phone',
    location: 'Warsaw, Poland',
    ip: '84.10.249.134',
    lastConnection: '18 minutes ago'
  },
  {
    device: 'iPad Air',
    type: 'tablet',
    location: 'Warsaw, Poland',
    ip: '84.10.249.134',
    lastConnection: '18 minutes ago'
  }
];

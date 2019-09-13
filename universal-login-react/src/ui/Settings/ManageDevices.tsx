import React from 'react';
import {Device} from '@universal-login/commons';

interface ManageDevicesProps {
  devices: Device[];
}

export const ManageDevices = ({devices}: ManageDevicesProps) => (
  <div>
    {
      devices.map(({deviceInfo}: Device, index: number) => (
        <div key={index}>
          device {index} : {deviceInfo.os}
          <button className="settings-btn">Remove this device</button>
        </div>))
    }
  </div >
);

export default ManageDevices;

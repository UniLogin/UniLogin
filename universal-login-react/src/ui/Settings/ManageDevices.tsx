import React from 'react';
import {DeviceInfo} from '@universal-login/commons';

interface ManageDevicesProps {
  devices: DeviceInfo[];
}
export const ManageDevices = ({devices}: ManageDevicesProps) => (
  <div>
    {
      devices && devices.map(({os}: DeviceInfo, index: number) => (<div key={index}> device {index} : {os}</div>))
    }
    <button className="settings-btn">Remove this device</button>
  </div >
);

export default ManageDevices;

import React from 'react';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';
import {DeviceInfo} from '@universal-login/commons';

export interface ConnectedDevicesProps {
  devicesList: DeviceInfo[];
}

export const ConnectedDevices = ({devicesList}: ConnectedDevicesProps) => {
  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
      </div>
      <ul className="connected-devices-list">
        {devicesList.map((deviceItem, index) => {

          return (
            <ConnectedDevicesItem
              key={index}
              devicesAmount={devicesList.length}
              {...deviceItem}
            />
          );
        })}
      </ul>
    </div>
  );
};

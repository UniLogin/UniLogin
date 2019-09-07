import React from 'react';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';

export interface Device {
  device: string;
  type: string;
  location: string;
  ip: string;
  lastConnection?: string;
}

export interface ConnectedDevicesProps {
  devicesList: Device[];
}

export const ConnectedDevices = ({devicesList}: ConnectedDevicesProps) => {
  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
      </div>
      <ul className="connected-devices-list">
        {devicesList.map((deviceItem, index) => {
          const {device, type, ip, location, lastConnection} = deviceItem;

          return (
            <ConnectedDevicesItem
              key={index}
              devicesAmount={devicesList.length}
              device={device}
              type={type}
              location={location}
              ip={ip}
              lastConnection={lastConnection}
            />
          );
        })}
      </ul>
    </div>
  );
};

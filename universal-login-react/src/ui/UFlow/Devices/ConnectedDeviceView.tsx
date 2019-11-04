import React, {ReactNode} from 'react';
import {DeviceInfo} from '@universal-login/commons';
import {Logo} from './Logo';

export interface ConnectedDeviceViewProps {
  deviceInfo: DeviceInfo;
  trashButton: ReactNode;
  isHighlighted: boolean;
}

export const ConnectedDeviceView = ({deviceInfo, isHighlighted, trashButton}: ConnectedDeviceViewProps) => {
  const {os, applicationName, type, ipAddress, city, logo} = deviceInfo;
  return (
    <li className={`connected-devices-item ${isHighlighted ? 'highlighted' : ''}`}>
      <Logo deviceType={type.toLowerCase()} logo={logo} applicationName={applicationName} />
      <div>
        <p className="connected-devices-type">{applicationName}{os && ` • ${os}`}</p>
        <p className="connected-devices-details">
          {ipAddress && `IP address: ${ipAddress} ${city}`}
        </p>
      </div>
      {trashButton}
    </li >
  );
};

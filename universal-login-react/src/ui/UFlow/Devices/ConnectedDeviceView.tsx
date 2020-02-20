import React, {ReactNode} from 'react';
import {DeviceInfo} from '@unilogin/commons';
import {Logo} from './Logo';

export interface ConnectedDeviceViewProps {
  deviceInfo: DeviceInfo;
  trashButton: ReactNode;
  isHighlighted: boolean;
}

export const ConnectedDeviceView = ({deviceInfo, isHighlighted, trashButton}: ConnectedDeviceViewProps) => {
  const {applicationName, type, city, logo, platform} = deviceInfo;
  return (
    <li className={`connected-devices-item ${isHighlighted ? 'highlighted' : ''}`}>
      <Logo deviceType={type.toLowerCase()} logo={logo} applicationName={applicationName} />
      <div>
        <p className="connected-devices-type">{applicationName}{platform && ` • ${platform}`}</p>
        <p className="connected-devices-details">
          {city}
        </p>
      </div>
      {trashButton}
    </li >
  );
};

import React, {ReactNode} from 'react';
import {DeviceInfo} from '@unilogin/commons';
import {Logo} from './Logo';

export interface ConnectedDeviceViewProps {
  deviceInfo: DeviceInfo;
  trashButton: ReactNode;
  isHighlighted: boolean;
}

export const ConnectedDeviceView = ({deviceInfo, isHighlighted, trashButton}: ConnectedDeviceViewProps) => {
  const {applicationName, type, city, logo, platform, browser} = deviceInfo;
  return (
    <li className={`connected-devices-item ${isHighlighted ? 'highlighted' : ''}`}>
      <Logo deviceType={type} logo={logo} applicationName={applicationName} />
      <div>
        {applicationName === 'Backup Code'
          ? <p className="connected-devices-type">Backup Code</p>
          : <>
            <p className="connected-devices-type">{browser}{platform && ` • ${platform}`}</p>
            <p className="connected-devices-details">
              {city}
            </p>
          </>
        }
      </div>
      {trashButton}
    </li >
  );
};

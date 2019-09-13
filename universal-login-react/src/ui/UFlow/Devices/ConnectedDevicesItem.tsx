import React, {useState} from 'react';
import {Device} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../../core/constants/TransactionDetails';

export interface ConnectedDevicesItemProps extends Device {
  devicesAmount: number;
  privateKey: string;
  sdk: UniversalLoginSDK;
}

export const ConnectedDevicesItem = ({devicesAmount, deviceInfo, sdk, contractAddress, publicKey, privateKey}: ConnectedDevicesItemProps) => {
  const {os, name, ipAddress, city, time} = deviceInfo;
  const [toBeRemoved, setToBeRemoved] = useState(false);

  return (
    <li className={`connected-devices-item ${name} ${toBeRemoved ? 'highlighted' : ''}`}>
      <div>
        <p className="connected-devices-type">{os} &bull; {city}</p>
        <p className="connected-devices-details">
          IP adress {ipAddress}
          {time
            ? time
            : <span className="connected-devices-active"> Active device</span>
          }
        </p>
      </div>
      {toBeRemoved
        ? <div className="connected-devices-buttons">
            <button onClick={() => setToBeRemoved(false)} className="connected-devices-cancel">Cancel</button>
            <button onClick={() => sdk.removeKey(contractAddress, publicKey, privateKey, transactionDetails)} className="connected-devices-delete">Delete</button>
        </div>
        : <div className="connected-devices-trash-btn-wrapper">
            <WarningMessage devicesAmount={devicesAmount} />
            <button onClick={() => setToBeRemoved(true)} className="connected-devices-trash-btn" />
        </div>
      }
    </li >
  );
};

export interface WarningMessageProps {
  devicesAmount: number;
}

const WarningMessage = ({devicesAmount}: WarningMessageProps) => <p className="warning-message">You cannot disconnect because you have {devicesAmount}-devices confirmation</p>;

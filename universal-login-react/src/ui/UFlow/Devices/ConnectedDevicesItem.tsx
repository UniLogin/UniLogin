import React, {useState} from 'react';
import {Device} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {transactionDetails} from '../../../core/constants/TransactionDetails';
import KickbackLogo from '../../assets/ucomponent/logo-kickback.svg';
import EvidanceLogo from '../../assets/ucomponent/evidance-logo.png';
import JarvisLogo from '../../assets/ucomponent/jarvis-logo.png';

export interface ConnectedDevicesItemProps extends Device {
  devicesAmount: number;
  deployedWallet: DeployedWallet;
  confirmationsCount: string;
}

export const ConnectedDevicesItem = ({devicesAmount, deviceInfo, publicKey, deployedWallet, confirmationsCount}: ConnectedDevicesItemProps) => {
  const {os, applicationName, type, ipAddress, city, time} = deviceInfo;
  const [toBeRemoved, setToBeRemoved] = useState(false);
  const confirmationsAmount = Number(confirmationsCount);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const showWarningMessage = () => {
    setIsWarningVisible(true);
    setTimeout(() => {
      setIsWarningVisible(false);
    }, 3000);
  };

  const onTrashButtonClick = () => {
    if (confirmationsAmount < devicesAmount) {
      setToBeRemoved(true);
    } else {
      showWarningMessage();
    }
  };

  // tslint:disable-next-line:no-unused-variable
  const getApplicationLogo = (applicationName : string) => {
    const getImage = (logo: string) => (<img src={logo} className="connected-devices-img" />);
    if (applicationName === 'kickback') {
      return getImage(KickbackLogo);
    } else if (applicationName === 'evidance') {
      return getImage(EvidanceLogo);
    } else if (applicationName === 'jarvis') {
      return getImage(JarvisLogo);
    }
    return null;
  };

  return (
    <li className={`connected-devices-item ${type.toLowerCase()} ${toBeRemoved ? 'highlighted' : ''}`}>
      {getApplicationLogo(applicationName ? applicationName.toLowerCase() : '')}
      <div>
        <p className="connected-devices-type">{applicationName} &bull; {os}</p>
        <p className="connected-devices-details">
          IP adress {ipAddress} {city}
          {time
            ? time
            : <span className="connected-devices-active"> Active device</span>
          }
        </p>
      </div>
      {toBeRemoved
        ? <div className="connected-devices-buttons">
            <button onClick={() => setToBeRemoved(false)} className="connected-devices-cancel">Cancel</button>
            <button onClick={() => deployedWallet.removeKey(publicKey, transactionDetails)} className="connected-devices-delete">Delete</button>
        </div>
        : <div className="connected-devices-trash-btn-wrapper">
            {isWarningVisible && <WarningMessage devicesAmount={devicesAmount} />}
            <button onClick={onTrashButtonClick} className="connected-devices-trash-btn" />
        </div>
      }
    </li >
  );
};

export interface WarningMessageProps {
  devicesAmount: number;
}

const WarningMessage = ({devicesAmount}: WarningMessageProps) => <p className="warning-message">You cannot disconnect because you have {devicesAmount}-devices confirmation</p>;

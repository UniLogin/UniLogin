import React, {useState} from 'react';
import {Device} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {transactionDetails} from '../../../core/constants/TransactionDetails';
import {Logo} from './Logo';
import {useHistory} from 'react-router';
import {join} from 'path';

export interface ConnectedDevicesItemProps extends Device {
  devicesAmount: number;
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  confirmationsCount: string;
}

export const ConnectedDevicesItem = ({devicesAmount, deviceInfo, publicKey, deployedWallet, devicesBasePath, confirmationsCount}: ConnectedDevicesItemProps) => {
  const {os, applicationName, type, ipAddress, city, logo} = deviceInfo;
  const [toBeRemoved, setToBeRemoved] = useState(false);
  const confirmationsAmount = Number(confirmationsCount);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const history = useHistory();

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

  const renderTrashButton = () => {
    const isCurrentDevice = deployedWallet.publicKey === publicKey;
    return !isCurrentDevice && (
      <div className="connected-devices-trash-btn-wrapper">
        {isWarningVisible && <WarningMessage devicesAmount={devicesAmount} />}
        <button onClick={onTrashButtonClick} className="connected-devices-trash-btn" />
      </div>
    );
  };

  const renderConfirmationButtons = () => (
    <div className="connected-devices-buttons">
      <button onClick={() => setToBeRemoved(false)} className="connected-devices-cancel">Cancel</button>
      <button onClick={onConfirmDeleteClick} className="connected-devices-delete">Delete</button>
    </div>
  );

  const onConfirmDeleteClick = async () => {
    history.push(join(devicesBasePath, '/waitingForRemovingDevice'));
    const {waitToBeSuccess} = await deployedWallet.removeKey(publicKey, transactionDetails);
    await waitToBeSuccess();
    history.replace(devicesBasePath);
  };

  return (
    <li className={`connected-devices-item ${toBeRemoved ? 'highlighted' : ''}`}>
      <Logo deviceType={type.toLowerCase()} logo={logo} applicationName={applicationName} />
      <div>
        <p className="connected-devices-type">{applicationName} &bull; {os}</p>
        <p className="connected-devices-details">
          IP address {ipAddress} {' '}{city}
        </p>
      </div>
      {toBeRemoved ? renderConfirmationButtons() : renderTrashButton()}
    </li >
  );
};

export interface WarningMessageProps {
  devicesAmount: number;
}

const WarningMessage = ({devicesAmount}: WarningMessageProps) => <p className="warning-message">You cannot disconnect because you have {devicesAmount}-devices confirmation</p>;

import React, {useState} from 'react';
import {Device} from '@unilogin/commons';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {ConnectedDeviceView} from './ConnectedDeviceView';

export interface ConnectedDeviceProps extends Device {
  devicesAmount: number;
  deployedWallet: DeployedWithoutEmailWallet;
  confirmationsCount: string;
  setDeviceToRemove: (arg: string | undefined) => void;
}

export const ConnectedDevice = ({devicesAmount, deviceInfo, publicKey, deployedWallet, confirmationsCount, setDeviceToRemove}: ConnectedDeviceProps) => {
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
      <button onClick={() => {setToBeRemoved(false); setDeviceToRemove(undefined);}} className="connected-devices-cancel">Cancel</button>
      <button onClick={() => setDeviceToRemove(publicKey)} className="connected-devices-delete">Delete</button>
    </div>
  );

  return <ConnectedDeviceView
    deviceInfo={deviceInfo}
    trashButton={toBeRemoved ? renderConfirmationButtons() : renderTrashButton()}
    isHighlighted={toBeRemoved}
  />;
};

export interface WarningMessageProps {
  devicesAmount: number;
}

const WarningMessage = ({devicesAmount}: WarningMessageProps) => <p className="warning-message">You cannot disconnect because you have {devicesAmount}-devices confirmation</p>;

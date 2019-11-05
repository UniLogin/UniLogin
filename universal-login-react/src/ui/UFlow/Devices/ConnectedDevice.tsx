import React, {useState} from 'react';
import {Device, ensureNotNull} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';
import {paymentOptions} from '../../../core/constants/PaymentOptions';
import {useHistory} from 'react-router';
import {join} from 'path';
import {ConnectedDeviceView} from './ConnectedDeviceView';

export interface ConnectedDeviceProps extends Device {
  devicesAmount: number;
  deployedWallet: DeployedWallet;
  devicesBasePath: string;
  confirmationsCount: string;
}

export const ConnectedDevice = ({devicesAmount, deviceInfo, publicKey, deployedWallet, devicesBasePath, confirmationsCount}: ConnectedDeviceProps) => {
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
    history.replace(join(devicesBasePath, '/waitingForRemovingDevice'));
    const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.removeKey(publicKey, paymentOptions);
    const {transactionHash} = await waitForTransactionHash();
    ensureNotNull(transactionHash, TypeError);
    history.replace(join(devicesBasePath, '/waitingForRemovingDevice'), {transactionHash});
    await waitToBeSuccess();
    history.replace(devicesBasePath);
  };

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

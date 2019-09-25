import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {useAsync} from '../../..';
import {transactionDetails} from '../../../core/constants/TransactionDetails';

interface ConfirmationsEditProps {
  deployedWallet: DeployedWallet;
  devicesAmount: number;
  confirmationsCount: string;
  setConfirmationsCount: (confirmations: string) => void;
}

export const ConfirmationsEdit = ({deployedWallet, devicesAmount, confirmationsCount, setConfirmationsCount}: ConfirmationsEditProps) => {
  const [isEditActive, setEditActive] = useState(false);
  let confirmationsAmount = Number(confirmationsCount);

  const [requiredSignatures] = useAsync(async () => {
    const signatures = (await deployedWallet.getRequiredSignatures()).toString();
    setConfirmationsCount(signatures);
    return signatures;
  }, []);

  const onSave = async () => {
    const requiredSignatures = parseInt(confirmationsCount, 10);
    if (isNaN(requiredSignatures) || requiredSignatures < 1 || requiredSignatures > devicesAmount) {
      return;
    }
    setEditActive(false);
    const execution = await deployedWallet.setRequiredSignatures(requiredSignatures, transactionDetails);
    await execution.waitToBeSuccess();
  };

  const onIncreaseButtonClick = () => setConfirmationsCount((++confirmationsAmount).toString());
  const onDecreaseButtonClick = () => {
    if (confirmationsAmount <= 1) {
      return;
    }
    setConfirmationsCount((--confirmationsAmount).toString());
  };

  const renderButton = () => {
    if (isEditActive) {
      return <button className="devices-confirmation-save-button" onClick={onSave}>Save</button>;
    } else {
      return (
        <button className="devices-confirmation-edit-button" onClick={() => requiredSignatures && setEditActive(true)}>
          Edit
        </button>
      );
    }
  };

  return (
    <div className="devices-confirmation-wrapper">
      <h2 className="devices-confirmation-text">Devices confirmation</h2>
      <div className="devices-confirmation-input-wrapper">
        <input
          type="number"
          step={1}
          pattern="\d+"
          className="devices-confirmation-input"
          value={requiredSignatures ? confirmationsCount : ''}
          onChange={event => setConfirmationsCount(event.target.value)}
          disabled={!isEditActive}
          min="0"
        />
        {isEditActive &&
          <div className="devices-amount-buttons">
            <button onClick={onIncreaseButtonClick} className="devices-amount-increase-btn" />
            <button onClick={onDecreaseButtonClick} className="devices-amount-decrease-btn" />
          </div>
        }
      </div>
      {renderButton()}
    </div>
  );
};


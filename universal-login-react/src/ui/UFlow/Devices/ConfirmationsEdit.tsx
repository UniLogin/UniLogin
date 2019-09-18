import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {useAsync} from '../../..';
import {transactionDetails} from '../../../core/constants/TransactionDetails';

interface ConfirmationsEditProps {
  deployedWallet: DeployedWallet;
  devicesAmount: number;
}

export const ConfirmationsEdit = ({deployedWallet, devicesAmount}: ConfirmationsEditProps) => {
  const [isEditActive, setEditActive] = useState(false);
  const [confirmationsCount, setConfirmationsCount] = useState<string>('');

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
      <input
        type="number"
        step={1}
        pattern="\d+"
        className="devices-confirmation-input"
        value={requiredSignatures ? confirmationsCount : ''}
        onChange={event => setConfirmationsCount(event.target.value)}
        disabled={!isEditActive}
      />
      {renderButton()}
    </div>
  );
};


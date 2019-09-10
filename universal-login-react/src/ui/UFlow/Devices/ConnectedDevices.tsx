import React, {useState} from 'react';
import {ConnectedDevicesItem} from './ConnectedDevicesItem';
import {DeviceInfo} from '@universal-login/commons';
import {useAsync} from '../../..';
import {DeployedWallet} from '@universal-login/sdk';
import {transactionDetails} from '../../../core/constants/TransactionDetails';

export interface ConnectedDevicesProps {
  devicesList: DeviceInfo[];
  deployedWallet: DeployedWallet;
}

export const ConnectedDevices = ({devicesList, deployedWallet}: ConnectedDevicesProps) => {
  const [isEditActive, setEditActive] = useState(false);
  const [confirmationsCount, setConfirmationsCount] = useState<string>('');

  const [requiredSignatures] = useAsync(async () => {
    const signatures = (await deployedWallet.getRequiredSignatures()).toString();
    setConfirmationsCount(signatures);
    return signatures;
  }, []);

  const onSave = async () => {
    const requiredSignatures = parseInt(confirmationsCount, 10);
    if (isNaN(requiredSignatures) || requiredSignatures < 1 || requiredSignatures > devicesList.length) {
      return;
    }
    setEditActive(false);
    const execution = await deployedWallet.setRequiredSignatures(requiredSignatures, transactionDetails);
    await execution.waitToBeMined();
  };

  return (
    <div className="connected-devices">
      <div className="connected-devices-header">
        <h2 className="connected-devices-title">{devicesList.length} connected devices</h2>
        <div className="devices-confirmation-wrapper">
          <h2 className="devices-confirmation-text">Devices confirmation</h2>
          <input
            type="number"
            step={1}
            pattern="\d+"
            className="devices-confirmation-input"
            value={requiredSignatures && confirmationsCount}
            onChange={event => setConfirmationsCount(event.target.value)}
            disabled={!isEditActive}
          />
          {isEditActive ?
            <button className="devices-confirmation-save-button" onClick={onSave}>Save</button>
            :
            <button
              className="devices-confirmation-edit-button"
              onClick={() => requiredSignatures && setEditActive(true)}
            >
              Edit
            </button>
          }
        </div>
      </div>
      <ul className="connected-devices-list">
        {devicesList.map((deviceItem, index) => {
          return (
            <ConnectedDevicesItem
              key={index}
              devicesAmount={devicesList.length}
              {...deviceItem}
            />
          );
        })}
      </ul>
    </div>
  );
};

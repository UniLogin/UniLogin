import React from 'react';
import {Device, DEFAULT_PAYMENT_OPTIONS} from '@universal-login/commons';
import {DeployedWallet} from '@universal-login/sdk';

interface ManageDevicesProps {
  deployedWallet: DeployedWallet;
  devices: Device[];
}

export const ManageDevices = ({devices, deployedWallet}: ManageDevicesProps) => (
  <div>
    {
      devices.map(({contractAddress, publicKey}: Device, index: number) => (
        <div key={index}>
          device {index} : {publicKey}
          <button onClick={() => deployedWallet.removeKey(publicKey, DEFAULT_PAYMENT_OPTIONS)} className="settings-btn">Remove this device</button>
        </div>))
    }
  </div >
);

export default ManageDevices;

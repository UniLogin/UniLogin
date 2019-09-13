import React from 'react';
import {Device} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../core/constants/TransactionDetails';

interface ManageDevicesProps {
  privateKey: string;
  sdk: UniversalLoginSDK;
  devices: Device[];
}

export const ManageDevices = ({devices, privateKey, sdk}: ManageDevicesProps) => (
  <div>
    {
      devices.map(({contractAddress, publicKey}: Device, index: number) => (
        <div key={index}>
          device {index} : {publicKey}
          <button onClick={() => sdk.removeKey(contractAddress, publicKey, privateKey, transactionDetails)} className="settings-btn">Remove this device</button>
        </div>))
    }
  </div >
);

export default ManageDevices;

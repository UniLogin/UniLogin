import React from 'react';
import {ConnectionNotification} from '../Notifications/ConnectionNotification';
import UniversalLoginSDK from '@universal-login/sdk';
import './../styles/approve-device.css';

export interface ApproveDeviceProps {
  contractAddress: string;
  privateKey: string;
  sdk: UniversalLoginSDK;
}

export const ApproveDevice = ({contractAddress, privateKey, sdk}: ApproveDeviceProps) => (
  <div className="approve-device">

    <ConnectionNotification
      contractAddress={contractAddress}
      privateKey={privateKey}
      sdk={sdk}
    />
  </div>
);

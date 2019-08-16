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
    <p className="approve-device-title">Approve device</p>
    <p className="approve-device-text">A new device tries to connects to this aacount.
Enter the emojis in the correct order to approve it.</p>
    <ConnectionNotification
      contractAddress={contractAddress}
      privateKey={privateKey}
      sdk={sdk}
    />
  </div>
);

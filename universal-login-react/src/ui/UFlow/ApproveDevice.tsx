import React from 'react';
import {ConnectionNotification} from '../Notifications/ConnectionNotification';
import {DeployedWallet} from '@universal-login/sdk';
import './../styles/approve-device.sass';

export interface ApproveDeviceProps {
  deployedWallet: DeployedWallet;
}

export const ApproveDevice = ({deployedWallet}: ApproveDeviceProps) => (
  <div className="approve-device">
    <ConnectionNotification
      deployedWallet={deployedWallet}
    />
  </div>
);

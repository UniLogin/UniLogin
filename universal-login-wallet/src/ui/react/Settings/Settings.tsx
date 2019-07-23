import React from 'react';
import {BackupCodes, ManageDevices} from '@universal-login/react';

export const Settings = () => (
  <div className="subscreen">
    <h1 className="subscreen-title">Settings:</h1>
    <ManageDevices />
    <BackupCodes />
  </div>
);

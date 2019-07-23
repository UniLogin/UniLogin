import React from 'react';
import ManageDevices from './ManageDevices';
import BackupCodes from './BackupCodes/BackupCodes';

export const Settings = () => (
  <div className="subscreen">
    <h1 className="subscreen-title">Settings:</h1>
    <ManageDevices />
    <BackupCodes />
  </div>
);

import React from 'react';
import Sidebar from '../common/Sidebar';
import UserDropdown from '../common/UserDropdown';
import ManageDevices from './ManageDevices';
import BackupCodes from './BackupCodes/BackupCodes';

const SettingsScreen = () => (
  <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content dashboard-content-subscreen">
      <UserDropdown />
      <div className="subscreen">
        <h1 className="subscreen-title">Settings:</h1>
        <ManageDevices />
        <BackupCodes />
      </div>
    </div>
  </div>
);

export default SettingsScreen;

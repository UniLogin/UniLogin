import React from 'react';
import Sidebar from '../common/Sidebar';
import {Settings} from '@universal-login/react';
import UserDropdown from '../common/UserDropdown';

const SettingsScreen = () => (
  <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content dashboard-content-subscreen">
      <UserDropdown />
      <Settings />
    </div>
  </div>
);

export default SettingsScreen;

import React from 'react';
import Sidebar from '../common/Sidebar';
import UserDropdown from '../common/UserDropdown';
import {Settings} from './Settings';

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

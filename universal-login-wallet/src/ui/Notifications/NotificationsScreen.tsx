import React from 'react';
import Sidebar from '../common/Sidebar';
import Notifications from './Notifications';
import UserDropdown from '../common/UserDropdown';

const NotificationsScreen = () => (
  <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content dashboard-content-subscreen">
      <UserDropdown />
      <Notifications />
    </div>
  </div>
);

export default NotificationsScreen;

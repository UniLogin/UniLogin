import React from 'react';
import Sidebar from '../common/Sidebar';
import Notifications from './Notifications';

const NotificationsScreen = () => (
  <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content">
      <Notifications />
    </div>
  </div>
);

export default NotificationsScreen;

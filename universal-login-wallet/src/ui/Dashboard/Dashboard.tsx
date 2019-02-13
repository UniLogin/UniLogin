import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from './Notifications';
import UserSelect from './UserSelect';
import LatestTransfers from './LatestTransfersSection';
import ChartSection from './ChartSection';

const Dashboard = () => (
  <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content">
      <Header>
        <Notifications />
        <UserSelect />
      </Header>
      <ChartSection />
      <LatestTransfers />
    </div>
  </div>
);

export default Dashboard;

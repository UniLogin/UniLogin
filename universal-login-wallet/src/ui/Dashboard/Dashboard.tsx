import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from './Notifications';
import UserSelect from './UserSelect';
import LatestTransfers from './LatestTransfersSection';
import ChartSection from './ChartSection';
import Modal from '../Modals/Modal';

const Dashboard = ({services}: {services: any}) => {
  return (
    <>
      <div className="dashboard">
        <Sidebar emitter={services.emitter}/>
        <div className="dashboard-content">
          <Header>
            <Notifications />
            <UserSelect />
          </Header>
          <ChartSection />
          <LatestTransfers />
        </div>
      </div>
      <Modal emitter={services.emitter}/>
    </>
  );
};

export default Dashboard;

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from '../Notifications/Notifications';
import UserSelect from './UserSelect';
import Modal from '../Modals/Modal';

const Dashboard = () => (
  <>
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header>
          <Notifications />
          <UserSelect />
        </Header>
      </div>
    </div>
    <Modal />
  </>
);

export default Dashboard;

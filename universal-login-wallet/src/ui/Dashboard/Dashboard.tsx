import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from '../Notifications/Notifications';
import UserSelect from './UserSelect';
import Modal from '../Modals/Modal';
import Balance from './Balance';

const Dashboard = () => (
  <>
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header>
          <Notifications />
          <UserSelect />
        </Header>
        <div className="dashboard-content">
          <div className="dashboard-buttons-row">
            <button className="btn btn-primary btn-add">Top-up</button>
            <button className="btn btn-secondary btn-send">Send</button>
          </div>
          <Balance className="dashboard-balance"/>
        </div>
      </div>
    </div>
    <Modal />
  </>
);

export default Dashboard;

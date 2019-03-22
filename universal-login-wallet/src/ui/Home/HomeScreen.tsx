import React from 'react';
import Sidebar from '../common/Sidebar';
import UserDropdown from './UserDropdown';
import Modal from '../Modals/Modal';
import Balance from './Balance';
import { useServices } from '../../hooks';

const HomeScreen = () => {
  const {modalService} = useServices();
  return (
    <>
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <UserDropdown />
          <div className="dashboard-buttons-row">
            <button onClick={() => modalService.showModal('request')} className="btn btn-primary btn-add">Top-up</button>
            <button id="transferFunds" onClick={() => modalService.showModal('transfer')} className="btn btn-secondary btn-send">Send</button>
          </div>
          <Balance className="dashboard-balance"/>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

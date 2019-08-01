import React, {useContext} from 'react';
import Sidebar from '../common/Sidebar';
import UserDropdown from '../common/UserDropdown';
import Modal from '../Modals/Modal';
import Balance from './Balance';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';


const HomeScreen = () => {
  const modalService = useContext(WalletModalContext);
  return (
    <>
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <UserDropdown/>
          <div className="home-screen-column">
            <div className="dashboard-buttons-row">
              <button
                onClick={() => modalService.showModal('request')}
                className="btn btn-primary btn-add"
              >
                <span className="btn-add-text">Top-up</span>
              </button>
              <button
                id="transferFunds"
                onClick={() => modalService.showModal('transfer')}
                className="btn btn-secondary btn-send"
              >
                <span className="btn-send-text">Send</span>
              </button>
            </div>
            <Balance className="dashboard-balance"/>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

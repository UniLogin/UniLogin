import React from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import Balance from './Balance';


const HomeScreen = () => {
  return (
    <>
      <div className="dashboard">
        <Header />
        <div className="dashboard-content">
          <Balance />
        </div>
        <div className="my-assets-section" />
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

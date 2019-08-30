import React from 'react';
import {Assets} from '@universal-login/react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import Balance from './Balance';
import {useServices} from '../../hooks';


const HomeScreen = () => {
  const {sdk, walletPresenter} = useServices();
  return (
    <>
      <div className="dashboard">
        <Header />
        <div className="dashboard-content">
          <Balance />
          <Assets sdk={sdk} ensName={walletPresenter.getName()} />
        </div>
        <div className="my-assets-section" />
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

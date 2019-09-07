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
        </div>
        <div className="my-assets-section">
          <Assets
            sdk={sdk}
            ensName={walletPresenter.getName()}
            className="jarvis-assets"
          />
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

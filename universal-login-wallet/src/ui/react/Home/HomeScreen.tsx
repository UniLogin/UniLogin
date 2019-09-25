import React, {useState, useContext} from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {Funds} from '@universal-login/react';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';


const HomeScreen = () => {
  const {sdk, walletPresenter} = useServices();
  const modalService = useContext(WalletModalContext);
  const [content] = useState('balance');

  const renderContent = () => {
    switch (content) {
      case 'balance':
        return (
          <Funds
            contractAddress={walletPresenter.getContractAddress()}
            ensName={walletPresenter.getName()}
            sdk={sdk}
            onTopUpClick={() => {}}
            onSendClick={() => modalService.showModal('transfer')}
            className="jarvis-funds"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dashboard">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-content-box">
            {renderContent()}
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

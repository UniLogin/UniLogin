import React, {useState, useContext} from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {Funds, Devices, BackupCodes} from '@universal-login/react';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {walletService} = useServices();
  const modalService = useContext(WalletModalContext);
  const [content, setContent] = useState('balance');

  const renderContent = () => {
    switch (content) {
      case 'balance':
        return (
          <Funds
            deployedWallet={walletService.getDeployedWallet()}
            onTopUpClick={() => {}}
            onSendClick={() => modalService.showModal('transfer')}
            className="jarvis-funds"
          />
        );
      case 'devices':
        return (
          <Devices
            deployedWallet={walletService.getDeployedWallet()}
            className="jarvis-styles"
          />
        );
      case 'backup':
        return (
          <BackupCodes
            deployedWallet={walletService.getDeployedWallet()}
            className="jarvis-backup"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dashboard">
        <Header setContent={setContent} />
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

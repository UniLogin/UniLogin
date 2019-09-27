import React, {useState, useContext} from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {Funds, Devices, BackupCodes, DeleteAccount, ConnectionNotification} from '@universal-login/react';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {sdk, walletPresenter, walletService} = useServices();
  const modalService = useContext(WalletModalContext);
  const [content, setContent] = useState('balance');

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
      case 'devices':
        return (
          <Devices
            sdk={sdk}
            contractAddress={walletPresenter.getContractAddress()}
            privateKey={walletPresenter.getPrivateKey()}
            ensName={walletPresenter.getName()}
            onManageDevicesClick={() => setContent('approveDevice')}
            className="jarvis-devices"
            onDeleteAccountClick={() => setContent('deleteAccount')}
          />
        );
      case 'backup':
        return (
          <BackupCodes
            deployedWallet={walletService.getDeployedWallet()}
            className="jarvis-backup"
          />
        );
      case 'deleteAccount':
        return (
          <DeleteAccount
            onCancelClick={() => setContent('devices')}
            onConfirmDeleteClick={() => {}}
            className="jarvis-delete-account"
          />
        );
      case 'approveDevice':
        return (
          <div id="notifications">
            <ConnectionNotification
              deployedWallet={walletService.getDeployedWallet()}
              className="jarvis-emojis"
            />
          </div>
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

import React, {useState, useContext} from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices, useRouter} from '../../hooks';
import {Funds, Devices, BackupCodes, Notice} from '@universal-login/react';
import {WalletModalContext, TopUpModalProps} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {walletService} = useServices();
  const router = useRouter();
  const modalService = useContext(WalletModalContext);
  const [content, setContent] = useState('balance');

  const {sdk} = walletService.getDeployedWallet();
  const notice = sdk.getNotice();

  const topUpProps: TopUpModalProps = {
    isDeployment: false,
    hideModal: modalService.hideModal,
  };

  const renderContent = () => {
    switch (content) {
      case 'balance':
        return (
          <Funds
            deployedWallet={walletService.getDeployedWallet()}
            onTopUpClick={() => modalService.showModal('topUpAccount', topUpProps)}
            onSendClick={() => modalService.showModal('transfer')}
            className="jarvis-funds"
          />
        );
      case 'devices':
        return (
          <Devices
            deployedWallet={walletService.getDeployedWallet()}
            onDeleteAccountClick={() => disconnectFromWallet(walletService, router)}
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
            <Notice message={notice}/>
            {renderContent()}
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

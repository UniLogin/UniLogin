import React, {useState, useContext} from 'react';
import {Assets, Devices} from '@universal-login/react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import Balance from './Balance';
import {useServices} from '../../hooks';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {sdk, walletPresenter} = useServices();
  const [content, setContent] = useState('balance');
  const modalService = useContext(WalletModalContext);

  const renderContent = () => {
    switch (content) {
      case 'balance':
        return (
          <div className="balance-section">
            <Balance />
            <Assets
              sdk={sdk}
              ensName={walletPresenter.getName()}
              className="jarvis-assets"
            />
          </div>
        );
      case 'devices':
        return (
          <div className="dashboard-content-box">
            <Devices
              sdk={sdk}
              contractAddress={walletPresenter.getContractAddress()}
              privateKey={walletPresenter.getPrivateKey()}
              ensName={walletPresenter.getName()}
              className="jarvis-devices"
              onManageDevicesClick={() => modalService.showModal('approveDevice')}
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
        <Header setContent={content => setContent(content)}/>
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

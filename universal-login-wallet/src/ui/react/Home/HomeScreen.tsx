import React, {useState, useContext} from 'react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {Funds, Devices, BackupCodes, Notice} from '@universal-login/react';
import {WalletModalContext, TopUpModalProps} from '../../../core/entities/WalletModalContext';
import {Route, Switch} from 'react-router';

const HomeScreen = () => {
  const {walletService} = useServices();
  const modalService = useContext(WalletModalContext);

  const {sdk} = walletService.getDeployedWallet();
  const notice = sdk.getNotice();

  const topUpProps: TopUpModalProps = {
    isDeployment: false,
    hideModal: modalService.hideModal
  };

  return (
    <>
      <div className="dashboard">
        <Header/>
        <div className="dashboard-content">
          <div className="dashboard-content-box">
            <Notice message={notice}/>
            <Switch>
              <Route path="/" exact>
                <Funds
                  deployedWallet={walletService.getDeployedWallet()}
                  onTopUpClick={() => modalService.showModal('topUpAccount', topUpProps)}
                  onSendClick={() => modalService.showModal('transfer')}
                  className="jarvis-funds"
                />
              </Route>
              <Route path="/devices" exact>
                <Devices
                  deployedWallet={walletService.getDeployedWallet()}
                  basePath="/devices"
                  className="jarvis-styles"
                />
              </Route>
              <Route path="/backup" exact>
                <BackupCodes
                  deployedWallet={walletService.getDeployedWallet()}
                  className="jarvis-backup"
                />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomeScreen;

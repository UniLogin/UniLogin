import React, {useContext} from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {Funds, Devices, BackupCodes, Notice} from '@universal-login/react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {WalletModalContext, TopUpModalProps} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {walletService, walletPresenter} = useServices();
  const modalService = useContext(WalletModalContext);

  const {sdk} = walletService.getDeployedWallet();
  const notice = sdk.getNotice();

  const topUpProps: TopUpModalProps = {
    isDeployment: false,
    hideModal: modalService.hideModal,
  };

  const history = useHistory();

  return (
    <>
      <div className="dashboard">
        <Header/>
        <div className="dashboard-content">
          <div className="dashboard-content-box">
            <Notice message={notice}/>
            <p className="dashboard-ens-name">{walletPresenter.getName()}</p>
            <Switch>
              <Route path="/" exact>
                <Funds
                  deployedWallet={walletService.getDeployedWallet()}
                  onTopUpClick={() => modalService.showModal('topUpAccount', topUpProps)}
                  onSendClick={() => modalService.showModal('transfer')}
                  onDeviceMessageClick={() => history.push('/devices/approveDevice')}
                  className="jarvis-styles"
                />
              </Route>
              <Route path="/devices">
                <Devices
                  walletService={walletService}
                  onAccountDeleted={() => history.push('/welcome')}
                  basePath="/devices"
                  className="jarvis-styles"
                />
              </Route>
              <Route path="/backup">
                <BackupCodes
                  deployedWallet={walletService.getDeployedWallet()}
                  basePath="/backup"
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

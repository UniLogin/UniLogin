import React, {useContext, useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {Funds, Devices, BackupCodes, Notice, TopUp} from '@universal-login/react';
import {Header} from './Header';
import Modal from '../Modals/Modal';
import {useServices} from '../../hooks';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const HomeScreen = () => {
  const {walletService, walletPresenter} = useServices();
  const modalService = useContext(WalletModalContext);

  const deployedWallet = walletService.getDeployedWallet();
  const notice = deployedWallet.sdk.getNotice();

  useEffect(() => deployedWallet.subscribeDisconnected(() => walletService.disconnect()), []);

  const history = useHistory();

  return (
    <>
      <div className="dashboard">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-content-box">
            <Notice message={notice} />
            <p className="dashboard-ens-name">{walletPresenter.getName()}</p>
            <Switch>
              <Route path="/" exact>
                <Funds
                  deployedWallet={walletService.getDeployedWallet()}
                  onTopUpClick={() => history.push('/topup')}
                  onSendClick={() => modalService.showModal('transfer')}
                  onDeviceMessageClick={() => history.push('/devices/approveDevice')}
                  className="jarvis-styles"
                />
              </Route>
              <Route path="/devices">
                <Devices
                  walletService={walletService}
                  onAccountDisconnected={() => history.push('/welcome')}
                  basePath="/devices"
                  className="jarvis-styles"
                />
              </Route>
              <Route path="/backup">
                <BackupCodes
                  deployedWallet={walletService.getDeployedWallet()}
                  className="jarvis-backup"
                />
              </Route>
              <Route exact path="/topup">
                <TopUp
                  sdk={walletService.getDeployedWallet().sdk}
                  contractAddress={walletService.getDeployedWallet().contractAddress}
                  topUpClassName="jarvis-styles"
                  isDeployment={false}
                  hideModal={() => history.push('/')}
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

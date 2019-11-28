import React, {useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {Funds, Devices, BackupCodes, Notice, TopUp} from '@universal-login/react';
import {Header} from './Header';
import {useServices} from '../../hooks';
import ModalTransfer from '../Modals/Transfer/ModalTransfer';

const HomeScreen = () => {
  const {walletService, walletPresenter} = useServices();

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
                  onTopUpClick={() => history.push('/topUp')}
                  onSendClick={() => history.push('/transfer')}
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
              <Route path="/topUp">
                <TopUp
                  sdk={walletService.getDeployedWallet().sdk}
                  contractAddress={walletService.getDeployedWallet().contractAddress}
                  topUpClassName="jarvis-styles"
                  isDeployment={false}
                  logoColor="black"
                  hideModal={() => history.push('/')}
                />
              </Route>
              <Route
                path="/transfer"
                render={() => <ModalTransfer basePath="/transfer" />}
              />
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;

import {join} from 'path';
import React from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {Funds, Devices, BackupCodes, Notice, TopUp, useAsyncEffect, useThemeClassFor} from '@unilogin/react';
import {Header} from './Header';
import {useServices} from '../../hooks';
import ModalTransfer from '../Modals/Transfer/ModalTransfer';

const HomeScreen = () => {
  const basePath = '/dashboard';
  const {walletService, walletPresenter} = useServices();

  const deployedWallet = walletService.getDeployedWallet();
  const notice = deployedWallet.sdk.getNotice();

  useAsyncEffect(() => deployedWallet.subscribeDisconnected(() => walletService.disconnect()), []);

  const history = useHistory();

  return (
    <>
      <div className={`dashboard ${useThemeClassFor()}`}>
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-content-box">
            <Notice message={notice} />
            <div className={useThemeClassFor()}>
              <p className="dashboard-ens-name">{walletPresenter.getName()}</p>
              <Switch>
                <Route path={basePath} exact>
                  <Funds
                    walletService={walletService}
                    onTopUpClick={() => history.push(join(basePath, 'topUp'))}
                    onSendClick={() => history.push(join(basePath, 'transfer'))}
                    onDeviceMessageClick={() => history.push(join(basePath, 'devices', 'approveDevice'))}
                  />
                </Route>
                <Route path={join(basePath, 'devices')}>
                  <Devices
                    walletService={walletService}
                    onAccountDisconnected={() => history.push('/welcome')}
                    basePath={join(basePath, 'devices')}
                  />
                </Route>
                <Route path={join(basePath, 'backup')}>
                  <BackupCodes deployedWallet={deployedWallet} />
                </Route>
                <Route path={join(basePath, 'topUp')}>
                  <TopUp
                    walletService={walletService}
                    logoColor="black"
                    hideModal={() => history.push('/dashboard')}
                  />
                </Route>
                <Route
                  path={join(basePath, 'transfer')}
                  render={() => <ModalTransfer basePath={join(basePath, 'transfer')} />}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;

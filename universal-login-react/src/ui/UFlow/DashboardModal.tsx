import {TransferService, WalletService, Execution} from '@unilogin/sdk';
import React from 'react';
import {Route, Switch, useHistory} from 'react-router';
import {TopUp} from '../TopUp/TopUp';
import {Devices} from './Devices/Devices';
import BackupCodes from '../BackupCodes/BackupCodes';
import {WaitingForTransaction} from '../commons/WaitingForTransaction';
import {DialogWrapper} from './DialogWrappers/DialogWrapper';
import {SubDialogWrapper} from './DialogWrappers/SubDialogWrapper';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {Funds} from './Funds';
import {Transfer} from '../Transfer/Transfer';
import {useClassFor} from '../utils/classFor';
import {join} from 'path';
import {MigrationFlow} from '../Migrating/MigrationFlow';
import {ErrorMessage} from '../..';

export interface DashboardModalProps {
  walletService: WalletService;
  onClose: () => void;
  basePath?: string;
}

export const DashboardModal = ({walletService, onClose, basePath = '/dashboard'}: DashboardModalProps) => {
  const history = useHistory();

  const deployedWallet = walletService.getDeployedWallet();
  const {sdk, name} = deployedWallet;
  const relayerConfig = sdk.getRelayerConfig();
  const notice = sdk.getNotice();

  const transferService = new TransferService(deployedWallet);

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    history.replace(join(basePath, 'waitingForTransfer'), {state: {transactionHash: ''}});
    const {waitToBeSuccess, waitForTransactionHash} = await transfer();
    const {transactionHash} = await waitForTransactionHash();
    if (history.location.pathname !== join(basePath, 'waitingForTransfer')) return;
    history.replace(join(basePath, 'waitingForTransfer'), {state: {transactionHash}});
    await waitToBeSuccess();
    if (history.location.pathname !== join(basePath, 'waitingForTransfer')) return;
    history.replace(join(basePath, 'funds'));
  };

  const closeBackup = () => {
    const message = 'Are you sure you want to leave? You might lose your backup code.';
    if (confirm(message)) onClose();
  };

  return (
    <div className={`udashboard ${useClassFor('udashboard')}`}>
      <Switch>
        <Route
          path={join(basePath, 'funds')}
          exact
          render={({history}) => (
            <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
              <DialogWrapper message={notice} deployedWallet={deployedWallet}>
                <Funds
                  walletService={walletService}
                  onTopUpClick={() => history.push(join(basePath, 'topUp'))}
                  onSendClick={() => history.push(join(basePath, 'transferAmount'))}
                  onDeviceMessageClick={() => history.push(join(basePath, 'devices/approveDevice'))}
                  onSecurityAlert={() => history.push(join(basePath, 'migration'))}
                />
              </DialogWrapper>
            </ModalWrapper>
          )}
        />
        <Route path={join(basePath, 'migration')}>
          <MigrationFlow
            onSuccess={() => history.push(join(basePath, 'funds'))}
            walletService={walletService}
            hideModal={onClose}
            onError={(e) => history.push(join(basePath, 'error'), {message: e.message})}
          />
        </Route>
        <Route path={join(basePath, 'topUp')} exact>
          <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
            <SubDialogWrapper message={notice} ensName={name}>
              <TopUp
                walletService={walletService}
                hideModal={onClose}
              />
            </SubDialogWrapper>
          </ModalWrapper>
        </Route>
        <Route
          path={join(basePath, 'transferAmount')}
          exact
          render={() => (
            <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
              <SubDialogWrapper message={notice} ensName={name}>
                <Transfer
                  transferService={transferService}
                  onTransferTriggered={onTransferTriggered}
                  sdk={sdk}
                />
              </SubDialogWrapper>
            </ModalWrapper>
          )}
        />
        <Route path={join(basePath, 'waitingForTransfer')}
          exact
          render={({location}) => (
            <ModalWrapper hideModal={() => history.replace('/dashboard/funds')}>
              <WaitingForTransaction
                action="Transferring funds"
                relayerConfig={relayerConfig!}
                transactionHash={location.state.transactionHash}
              />
            </ModalWrapper>
          )}
        />
        <Route path={join(basePath, 'devices')}>
          <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <Devices walletService={walletService} onAccountDisconnected={onClose} basePath={join(basePath, 'devices')} />
            </DialogWrapper>
          </ModalWrapper>
        </Route>
        <Route path={join(basePath, 'backup')}>
          <ModalWrapper hideModal={closeBackup} modalClassName="udashboard-modal">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <BackupCodes deployedWallet={deployedWallet} />
            </DialogWrapper>
          </ModalWrapper>
        </Route>
        <Route
          path={join(basePath, 'error')}
          render={({history, location}) =>
            <ModalWrapper hideModal={() => history.push(join(basePath, 'funds'))}>
              <ErrorMessage
                title={'Something went wrong'}
                message={location.state.message}
              />
            </ModalWrapper>
          } />
      </Switch>
    </div>
  );
};

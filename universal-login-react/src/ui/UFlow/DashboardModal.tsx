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

export interface DashboardModalProps {
  walletService: WalletService;
  onClose: () => void;
}

export const DashboardModal = ({walletService, onClose}: DashboardModalProps) => {
  const history = useHistory();

  const deployedWallet = walletService.getDeployedWallet();
  const {sdk, name} = deployedWallet;
  const relayerConfig = sdk.getRelayerConfig();
  const notice = sdk.getNotice();

  const transferService = new TransferService(deployedWallet);

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    history.replace('/dashboard/waitingForTransfer', {state: {transactionHash: ''}});
    const {waitToBeSuccess, waitForTransactionHash} = await transfer();
    const {transactionHash} = await waitForTransactionHash();
    if (history.location.pathname !== '/dashboard/waitingForTransfer') return;
    history.replace('/dashboard/waitingForTransfer', {state: {transactionHash}});
    await waitToBeSuccess();
    if (history.location.pathname !== '/dashboard/waitingForTransfer') return;
    history.replace('/dashboard/funds');
  };

  return (
    <div className="udashboard">
      <Switch>
        <Route
          path="/dashboard/funds"
          exact
          render={({history}) => (
            <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
              <DialogWrapper message={notice} deployedWallet={deployedWallet}>
                <Funds
                  deployedWallet={deployedWallet}
                  onTopUpClick={() => history.push('/dashboard/topUp')}
                  onSendClick={() => history.push('/dashboard/transferAmount')}
                  onDeviceMessageClick={() => history.push('/dashboard/devices/approveDevice')}
                />
              </DialogWrapper>
            </ModalWrapper>
          )}
        />
        <Route path="/dashboard/topUp" exact>
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
          path="/dashboard/transferAmount"
          exact
          render={() => (
            <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
              <SubDialogWrapper message={notice} ensName={name}>
                <Transfer
                  transferService={transferService}
                  onTransferTriggered={onTransferTriggered}
                />
              </SubDialogWrapper>
            </ModalWrapper>
          )}
        />
        <Route path="/dashboard/waitingForTransfer"
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
        <Route path="/dashboard/devices">
          <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <Devices walletService={walletService} onAccountDisconnected={onClose} basePath="/dashboard/devices" />
            </DialogWrapper>
          </ModalWrapper>
        </Route>
        <Route path="/dashboard/backup">
          <ModalWrapper hideModal={onClose} modalClassName="udashboard-modal">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <BackupCodes deployedWallet={deployedWallet} />
            </DialogWrapper>
          </ModalWrapper>
        </Route>
      </Switch>
    </div>
  );
};

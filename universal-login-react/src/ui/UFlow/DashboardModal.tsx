import {TransferService, WalletService, Execution} from '@universal-login/sdk';
import React, {useState} from 'react';
import {TokenDetailsWithBalance} from '@universal-login/commons';
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
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface DashboardModalProps {
  walletService: WalletService;
  onClose: () => void;
}

export const DashboardModal = ({walletService, onClose}: DashboardModalProps) => {
  const deployedWallet = walletService.getDeployedWallet();
  const {sdk, name} = deployedWallet;
  const relayerConfig = sdk.getRelayerConfig();

  const [transactionHash, setTransactionHash] = useState('');
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => deployedWallet.sdk.subscribeToBalances(deployedWallet.contractAddress, setTokenDetailsWithBalance), []);

  const notice = sdk.getNotice();

  const transferService = new TransferService(deployedWallet);
  const history = useHistory();

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    history.replace('/dashboard/waitingForTransfer');
    const {waitToBeSuccess, waitForTransactionHash} = await transfer();
    const {transactionHash} = await waitForTransactionHash();
    setTransactionHash(transactionHash!);
    await waitToBeSuccess();
    history.replace('/dashboard/funds');
  };

  return (
    <ModalWrapper
      hideModal={onClose}
      modalClassName="udashboard-modal"
    >
      <div className="udashboard">
        <Switch>
          <Route
            path="/dashboard/funds"
            exact
            render={({history}) => (
              <DialogWrapper message={notice} deployedWallet={deployedWallet}>
                <Funds
                  deployedWallet={deployedWallet}
                  onTopUpClick={() => history.push('/dashboard/topUp')}
                  onSendClick={() => history.push('/dashboard/transferAmount')}
                  onDeviceMessageClick={() => history.push('/dashboard/devices/approveDevice')}
                />
              </DialogWrapper>
            )}
          />
          <Route path="/dashboard/topUp" exact>
            <SubDialogWrapper message={notice} ensName={name}>
              <TopUp
                walletService={walletService}
                hideModal={onClose}
              />
            </SubDialogWrapper>
          </Route>
          <Route
            path="/dashboard/transferAmount"
            exact
            render={() => (
              <SubDialogWrapper message={notice} ensName={name}>
                <Transfer
                  transferService={transferService}
                  tokenDetailsWithBalance={tokenDetailsWithBalance}
                  onTransferTriggered={onTransferTriggered}
                />
              </SubDialogWrapper>
            )}
          />
          <Route path="/dashboard/waitingForTransfer" exact>
            <SubDialogWrapper message={notice} ensName={name}>
              <WaitingForTransaction
                action="Transferring funds"
                relayerConfig={relayerConfig!}
                transactionHash={transactionHash}
              />
            </SubDialogWrapper>
          </Route>
          <Route path="/dashboard/devices">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <Devices walletService={walletService} onAccountDisconnected={onClose} basePath="/dashboard/devices" />
            </DialogWrapper>
          </Route>
          <Route path="/dashboard/backup">
            <DialogWrapper message={notice} deployedWallet={deployedWallet}>
              <BackupCodes deployedWallet={deployedWallet} />
            </DialogWrapper>
          </Route>
        </Switch>
      </div>
    </ModalWrapper>
  );
};

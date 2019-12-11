import {TransferService, WalletService} from '@universal-login/sdk';
import React, {useState} from 'react';
import {TransferDetails, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import {Route, Switch} from 'react-router';
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
  const {relayerConfig} = sdk;

  const [transferDetails, setTransferDetails] = useState<TransferDetails>({transferToken: sdk.tokensDetailsStore.tokensDetails[0].address} as TransferDetails);
  const selectedToken = sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken!);
  const [transactionHash, setTransactionHash] = useState('');
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  useAsyncEffect(() => deployedWallet.sdk.subscribeToBalances(deployedWallet.contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(selectedToken.symbol, tokenDetailsWithBalance);

  const notice = sdk.getNotice();

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  const transferService = new TransferService(deployedWallet);

  const onTransferSendClick = async (changeContent: (argument: string) => void) => {
    transferService.validateInputs(transferDetails, balance);
    const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(transferDetails);
    changeContent('waitingForTransfer');
    const {transactionHash} = await waitForTransactionHash();
    setTransactionHash(transactionHash!);
    await waitToBeSuccess();
    changeContent('funds');
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
            render={({history}) => (
              <SubDialogWrapper message={notice} ensName={name}>
                <Transfer
                  deployedWallet={deployedWallet}
                  tokenDetails={selectedToken}
                  updateTransferDetailsWith={updateTransferDetailsWith}
                  tokenDetailsWithBalance={tokenDetailsWithBalance}
                  onSendClick={() => onTransferSendClick(tab => history.replace(`/dashboard/${tab}`))}
                  transferDetails={transferDetails}
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

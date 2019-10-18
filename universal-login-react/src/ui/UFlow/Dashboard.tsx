import React, {useEffect, useState} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {Funds} from './Funds';
import {asTransferDetails, GasParameters, TransferDetails} from '@universal-login/commons';
import {DeployedWallet, setBetaNotice, TransferService, WalletService} from '@universal-login/sdk';
import logoIcon from '../assets/icons/U.svg';
import './../styles/udashboard.sass';
import {TopUp} from '../TopUp/TopUp';
import {TransferAmount} from '../Transfer/Amount/TransferAmount';
import {TransferRecipient} from '../Transfer/Recipient/TransferRecipient';
import {Devices} from './Devices/Devices';
import BackupCodes from '../BackupCodes/BackupCodes';
import {cast} from '@restless/sanitizers';
import {InvalidTransferDetails} from '../../core/utils/errors';
import {WaitingForTransaction} from '../commons/WaitingForTransaction';
import {DialogWrapper} from './DialogWrappers/DialogWrapper';
import {SubDialogWrapper} from './DialogWrappers/SubDialogWrapper';
import {MemoryRouter, Route, Switch} from 'react-router';

export interface DashboardProps {
  deployedWallet: DeployedWallet;
}

function sanitizeTransferDetails(details: Partial<TransferDetails>) {
  try {
    return cast(details, asTransferDetails);
  } catch (e) {
    throw new InvalidTransferDetails();
  }
}

export const Dashboard = ({deployedWallet}: DashboardProps) => {
  const {contractAddress, privateKey, sdk, name} = deployedWallet;
  const {relayerConfig} = deployedWallet.sdk;
  const [transferDetails, setTransferDetails] = useState<Partial<TransferDetails>>({transferToken: sdk.tokensDetailsStore.tokensDetails[0].address} as TransferDetails);
  const selectedToken = sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken!);
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const [notice, setNotice] = useState('');
  useEffect(() => {
    setBetaNotice(sdk);
    setNotice(sdk.getNotice());
  });

  const [newNotifications, setNewNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNewNotifications), []);

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  const transferService = new TransferService(deployedWallet);

  const onTransferSendClick = async (changeContent: (argument: string) => void) => {
    const sanitizedDetails = sanitizeTransferDetails(transferDetails);
    changeContent('waitingForTransfer');
    const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(sanitizedDetails);
    const {transactionHash} = await waitForTransactionHash();
    setTransactionHash(transactionHash!);
    await waitToBeSuccess();
    changeContent('funds');
  };

  const walletService = new WalletService(sdk);
  walletService.setWallet(deployedWallet.asApplicationWallet);

  return (
    <>
      <button
        className={`udashboard-logo-btn ${newNotifications.length > 0 ? 'new-notifications' : ''}`}
        onClick={() => setDashboardVisibility(true)}
      >
        <img src={logoIcon} alt="U"/>
      </button>

      <MemoryRouter initialEntries={['/dashboard/funds']}>
        {dashboardVisibility && (
          <ModalWrapper
            hideModal={() => setDashboardVisibility(false)}
            modalClassName="udashboard-modal"
          >
            <div className="udashboard">
              <Switch>
                <Route
                  path="/dashboard/funds"
                  exact
                  render={({history}) => (
                    <DialogWrapper message={notice} ensName={name}>
                      <Funds
                        deployedWallet={deployedWallet}
                        onTopUpClick={() => history.push('/dashboard/topup')}
                        onSendClick={() => history.push('/dashboard/transferAmount')}
                      />
                    </DialogWrapper>
                  )}
                />
                <Route path="/dashboard/topup" exact>
                  <SubDialogWrapper message={notice} ensName={name}>
                    <TopUp
                      sdk={sdk}
                      hideModal={() => setDashboardVisibility(false)}
                      contractAddress={contractAddress}
                      isDeployment={false}
                    />
                  </SubDialogWrapper>
                </Route>
                <Route
                  path="/dashboard/transferAmount"
                  exact
                  render={({history}) => (
                    <SubDialogWrapper message={notice} ensName={name}>
                      <TransferAmount
                        deployedWallet={deployedWallet}
                        onSelectRecipientClick={() => history.push('/dashboard/transferRecipient')}
                        updateTransferDetailsWith={updateTransferDetailsWith}
                        tokenDetails={selectedToken}
                      />
                    </SubDialogWrapper>
                  )}
                />
                <Route
                  path="/dashboard/transferRecipient"
                  exact
                  render={({history}) => (
                    <SubDialogWrapper message={notice} ensName={name}>
                      <TransferRecipient
                        deployedWallet={deployedWallet}
                        onGasParametersChanged={(gasParameters: GasParameters) => updateTransferDetailsWith({gasParameters})}
                        symbol={selectedToken.symbol}
                        onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
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
                <Route
                  path="/dashboard/devices"
                  exact
                  render={({history}) => (
                    <SubDialogWrapper message={notice} ensName={name}>
                      <Devices walletService={walletService} onDeleteAccountClick={() => history.goBack()} basePath="/dashboard/devices" />
                    </SubDialogWrapper>
                  )}
                />
                <Route path="/dashboard/backup" exact>
                  <DialogWrapper message={notice} ensName={name}>
                    <BackupCodes deployedWallet={deployedWallet}/>
                  </DialogWrapper>
                </Route>
              </Switch>
            </div>
          </ModalWrapper>
        )}
      </MemoryRouter>
    </>
  );
};

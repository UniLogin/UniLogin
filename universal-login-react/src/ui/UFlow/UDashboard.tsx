import React, {useEffect, useState} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {asTransferDetails, TransferDetails, GasParameters, CurrencyToValue} from '@universal-login/commons';
import {DeployedWallet, TransferService, setBetaNotice} from '@universal-login/sdk';
import ethLogo from '../assets/icons/ethereum-logo.svg';
import {DashboardContentType} from '../../core/models/ReactUDashboardContentType';
import './../styles/udashboard.sass';
import {TopUp} from '../TopUp/TopUp';
import {TransferAmount} from '../Transfer/Amount/TransferAmount';
import {TransferRecipient} from '../Transfer/Recipient/TransferRecipient';
import {Devices} from './Devices/Devices';
import BackupCodes from '../BackupCodes/BackupCodes';
import {cast} from '@restless/sanitizers';
import {InvalidTransferDetails} from '../../core/utils/errors';
import {Notice} from '../commons/Notice';
import {UNavBarMobile} from './UNavBarMobile';
import {WaitingFor} from '../commons/WaitingFor';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface UDashboardProps {
  deployedWallet: DeployedWallet;
}

function sanitizeTransferDetails(details: Partial<TransferDetails>) {
  try {
    return cast(details, asTransferDetails);
  } catch (e) {
    throw new InvalidTransferDetails();
  }
}

export const UDashboard = ({deployedWallet}: UDashboardProps) => {
  const {contractAddress, privateKey, sdk} = deployedWallet;
  const {relayerConfig} = deployedWallet.sdk;
  const [transferDetails, setTransferDetails] = useState<Partial<TransferDetails>>({transferToken: sdk.tokensDetailsStore.tokensDetails[0].address} as TransferDetails);
  const selectedToken = sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken!);
  const [dashboardContent, setDashboardContent] = useState<DashboardContentType>('none');
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const [notice, setNotice] = useState('');
  useEffect(() => {
    setBetaNotice(sdk);
    setNotice(sdk.getNotice());
  });

  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(contractAddress, setTotalTokensValue), []);

  const [newNotifications, setNewNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNewNotifications), []);

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  const onUButtonClick = () => {
    setDashboardVisibility(true);
    setDashboardContent('funds');
  };

  const transferService = new TransferService(deployedWallet);

  const onTransferSendClick = async () => {
    const sanitizedDetails = sanitizeTransferDetails(transferDetails);
    setDashboardContent('waitingForTransfer');
    const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(sanitizedDetails);
    const {transactionHash} = await waitForTransactionHash();
    setTransactionHash(transactionHash!);
    await waitToBeSuccess();
    setDashboardContent('funds');
  };

  const renderDashboardContent = () => {
    switch (dashboardContent) {
      case 'funds':
        return (
          <>
            <Funds
              deployedWallet={deployedWallet}
              onTopUpClick={() => setDashboardContent('topup')}
              onSendClick={() => setDashboardContent('transferAmount')}
            />
            <UNavBarMobile activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          </>
        );
      case 'topup':
        return (
          <TopUp
            sdk={sdk}
            onGasParametersChanged={() => {}}
            hideModal={() => setDashboardVisibility(false)}
            contractAddress={contractAddress}
          />
        );
      case 'transferAmount':
        return (
          <TransferAmount
            deployedWallet={deployedWallet}
            onSelectRecipientClick={() => setDashboardContent('transferRecipient')}
            updateTransferDetailsWith={updateTransferDetailsWith}
            tokenDetails={selectedToken}
          />
        );
      case 'transferRecipient':
        return (
          <div>
            <TransferRecipient
              deployedWallet={deployedWallet}
              onGasParametersChanged={(gasParameters: GasParameters) => updateTransferDetailsWith({gasParameters})}
              symbol={selectedToken.symbol}
              onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
              onSendClick={onTransferSendClick}
              transferDetails={transferDetails}
            />
          </div>
        );
      case 'waitingForTransfer':
        return (
          <WaitingFor action={'Transferring funds'} chainName={relayerConfig!.chainSpec.name} transactionHash={transactionHash} />
        );
      case 'devices':
        return (
          <>
            <Devices
              deployedWallet={deployedWallet}
            />
            <UNavBarMobile activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          </>
        );
      case 'backup':
        return (
          <>
            <BackupCodes
              deployedWallet={deployedWallet}
            />
            <UNavBarMobile activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          </>
        );
      default:
        return null;
    }
  };


  return (
    <>
      <div
        className={`ul-button-ethereum-account ${newNotifications.length > 0 ? 'new-notifications' : ''}`}
        onClick={() => onUButtonClick()}
      >
        <div className="ul-logo">
          <img src={ethLogo} alt="Ethereum Logo" />
        </div>
        <div className="ul-name">{deployedWallet.name}</div>
        <div className="ul-balance"> ${totalTokensValue.USD} </div>
      </div>
      {dashboardVisibility &&
        <ModalWrapper
          hideModal={() => setDashboardVisibility(false)}
          modalClassName="udashboard-modal"
        >
          <div className="udashboard">
            <UHeader activeTab={dashboardContent} setActiveTab={setDashboardContent} />
            <Notice message={notice} />
            <div className="udashboard-content">
              {renderDashboardContent()}
            </div>
          </div>
        </ModalWrapper>
      }
    </>
  );
};

import React, {useEffect, useState} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {asTransferDetails, TransferDetails} from '@universal-login/commons';
import {DeployedWallet, TransferService, setBetaNotice} from '@universal-login/sdk';
import {useAsync} from '../hooks/useAsync';
import logoIcon from '../assets/icons/U.svg';
import {DashboardContentType} from '../../core/models/ReactUDashboardContentType';
import './../styles/udashboard.sass';
import {TopUp} from '../TopUp/TopUp';
import {TransferAmount} from '../Transfer/Amount/TransferAmount';
import {TransferRecipient} from '../Transfer/Recipient/TransferRecipient';
import {TransferInProgress} from './TransferInProgress';
import {Devices} from './Devices/Devices';
import BackupCodes from '../BackupCodes/BackupCodes';
import {cast} from '@restless/sanitizers';
import {InvalidTransferDetails} from '../../core/utils/errors';
import {Notice} from '../commons/Notice';

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
  const [transferDetails, setTransferDetails] = useState<Partial<TransferDetails>>({currency: sdk.tokensDetailsStore.tokensDetails[0].symbol});
  const [dashboardContent, setDashboardContent] = useState<DashboardContentType>('none');
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

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

  const onUButtonClick = () => {
    setDashboardVisibility(true);
    setDashboardContent('funds');
  };

  const transferService = new TransferService(deployedWallet);

  const onTransferSendClick = async () => {
    const sanitizedDetails = sanitizeTransferDetails(transferDetails);
    setDashboardContent('waitingForTransfer');
    await transferService.transfer(sanitizedDetails);
    setDashboardContent('funds');
  };

  const renderDashboardContent = () => {
    switch (dashboardContent) {
      case 'funds':
        return (
          <Funds
            deployedWallet={deployedWallet}
            onTopUpClick={() => setDashboardContent('topup')}
            onSendClick={() => setDashboardContent('transferAmount')}
          />
        );
      case 'topup':
        return (
          <TopUp
            sdk={sdk}
            onGasParametersChanged={() => {}}
            hideModal={() => setDashboardVisibility(false)}
            contractAddress={contractAddress}
            onRampConfig={relayerConfig!.onRampProviders}
            ipGeolocationApiConfig={relayerConfig!.ipGeolocationApi}
          />
        );
      case 'transferAmount':
        return (
          <TransferAmount
            deployedWallet={deployedWallet}
            onSelectRecipientClick={() => setDashboardContent('transferRecipient')}
            updateTransferDetailsWith={updateTransferDetailsWith}
            currency={transferDetails.currency!}
          />
        );
      case 'transferRecipient':
        return (
          <TransferRecipient
            onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
            onSendClick={onTransferSendClick}
            transferDetails={transferDetails}
          />
        );
      case 'waitingForTransfer':
        return (
          <TransferInProgress />
        );
      case 'devices':
        return (
          <Devices
            deployedWallet={deployedWallet}
          />
        );
      case 'backup':
        return (
          <BackupCodes
            deployedWallet={deployedWallet}
          />
        );
      default:
        return null;
    }
  };


  return (
    <>
      <button className={`udashboard-logo-btn ${newNotifications.length > 0 ? 'new-notifications' : ''}`} onClick={() => onUButtonClick()}>
        <img src={logoIcon} alt="U" />
      </button>
      {dashboardVisibility &&
        <ModalWrapper
          hideModal={() => setDashboardVisibility(false)}
          modalClassName="udashboard-modal"
        >
          <UHeader activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          <Notice message={notice}/>
          <div className="udashboard-content">
            {renderDashboardContent()}
          </div>
        </ModalWrapper>
      }
    </>
  );
};

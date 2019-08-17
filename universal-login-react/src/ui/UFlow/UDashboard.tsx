import React, {useState, useEffect} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {ApplicationWallet, TransferDetails} from '@universal-login/commons';
import {useAsync} from '../hooks/useAsync';
import UniversalLoginSDK, {TransferService} from '@universal-login/sdk';
import logoIcon from '../assets/icons/U.svg';
import {dashboardContentType} from '../../core/models/ReactUModalContext';
import './../styles/udashboard.css';
import {TopUp} from '../TopUp/TopUp';
import {ApproveDevice} from './ApproveDevice';
import {TransferAmount} from '../Transfer/Amount/TransferAmount';
import {TransferRecipient} from '../Transfer/Recipient/TransferRecipient';
import {TransferInProgress} from './TransferInProgress';

export interface UDashboardProps {
  applicationWallet: ApplicationWallet;
  sdk: UniversalLoginSDK;
}

export const UDashboard = ({applicationWallet, sdk}: UDashboardProps) => {
  const [transferDetalis, setTransferDetails] = useState({currency: sdk.tokensDetailsStore.tokensDetails[0].symbol} as TransferDetails);
  const [dashboardContent, setDashboardContent] = useState<dashboardContentType>('none');
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  const [newNotifications, setNewNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(applicationWallet.contractAddress, applicationWallet.privateKey, setNewNotifications), []);

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetalis, ...args});
  };

  const transferService = new TransferService(sdk, applicationWallet);

  const onUButtonClick = () => {
    setDashboardVisibility(true);
    setDashboardContent('funds');
  };

  const renderDashboardContent = () => {
    switch (dashboardContent) {
      case 'funds':
        return (
          <div>
            <p className="udashboard-name">{applicationWallet.name}</p>
            <Funds
              ensName={applicationWallet.name}
              sdk={sdk}
              onTopUpClick={() => setDashboardContent('topup')}
              onSendClick={() => setDashboardContent('transferAmount')}
              />
          </div>
        );
      case 'approveDevice':
        return (
          <ApproveDevice
            contractAddress={applicationWallet.contractAddress}
            privateKey={applicationWallet.privateKey}
            sdk={sdk}
          />
        );
      case 'topup':
        return (
          <TopUp
            hideModal={() => setDashboardVisibility(false)}
            contractAddress={applicationWallet.contractAddress}
            onRampConfig={relayerConfig!.onRampProviders}
          />
        );
      case 'transferAmount':
        return (
          <TransferAmount
            sdk={sdk}
            ensName={applicationWallet.name}
            onSelectRecipientClick={() => setDashboardContent('transferRecipient')}
            updateTransferDetailsWith={updateTransferDetailsWith}
            currency={transferDetalis.currency}
          />
        );
      case 'transferRecipient':
        const onGenerateClick = async () => {
          setDashboardContent('waitingForTransfer');
          await transferService.transfer(transferDetalis);
          setDashboardContent('funds');
        };
        return (
          <TransferRecipient
            onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
            onSendClick={onGenerateClick}
            transferDetalis={transferDetalis}
          />
        );
      case 'waitingForTransfer':
        return (
          <TransferInProgress />
        );
      default:
        return null;
    }
  };


  return (
    <>
      <button className={`udashboard-logo-btn ${newNotifications.length > 0 ? 'new-notifications' : ''}`} onClick={() => onUButtonClick()}>
        <img src={logoIcon} alt="U"/>
      </button>
      {dashboardVisibility &&
        <ModalWrapper
          hideModal={() => setDashboardVisibility(false)}
          modalClassName="udashboard-modal"
        >
          <UHeader activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          <div className="udashboard-content">
            {renderDashboardContent()}
          </div>
        </ModalWrapper>
      }
    </>
  );
};

import React, {useState, useEffect} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {TransferDetails} from '@universal-login/commons';
import {DeployedWallet, TransferService} from '@universal-login/sdk';
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

export interface UDashboardProps {
  deployedWallet: DeployedWallet;
}

export const UDashboard = ({deployedWallet}: UDashboardProps) => {
  const {contractAddress, privateKey, sdk} = deployedWallet;
  const [transferDetails, setTransferDetails] = useState({currency: sdk.tokensDetailsStore.tokensDetails[0].symbol} as TransferDetails);
  const [dashboardContent, setDashboardContent] = useState<DashboardContentType>('none');
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  const [newNotifications, setNewNotifications] = useState([] as Notification[]);
  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNewNotifications), []);

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  const transferService = new TransferService(deployedWallet);

  const onUButtonClick = () => {
    setDashboardVisibility(true);
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
          />
        );
      case 'transferAmount':
        return (
          <TransferAmount
            deployedWallet={deployedWallet}
            onSelectRecipientClick={() => setDashboardContent('transferRecipient')}
            updateTransferDetailsWith={updateTransferDetailsWith}
            currency={transferDetails.currency}
          />
        );
      case 'transferRecipient':
        const onGenerateClick = async () => {
          setDashboardContent('waitingForTransfer');
          await transferService.transfer(transferDetails);
          setDashboardContent('funds');
        };
        return (
          <TransferRecipient
            onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
            onSendClick={onGenerateClick}
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
          <div className="udashboard-content">
            {renderDashboardContent()}
          </div>
        </ModalWrapper>
      }
    </>
  );
};

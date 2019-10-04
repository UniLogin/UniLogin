import React, {useEffect, useState} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {asTransferDetails, TransferDetails, DEFAULT_GAS_LIMIT, GasParameters} from '@universal-login/commons';
import {DeployedWallet, TransferService, setBetaNotice} from '@universal-login/sdk';
import logoIcon from '../assets/icons/U.svg';
import {DashboardContentType, DashboardOptionalArgs} from '../../core/models/ReactUDashboardContentType';
import './../styles/udashboard.sass';
import {TopUp} from '../TopUp/TopUp';
import {TransferAmount} from '../Transfer/Amount/TransferAmount';
import {TransferRecipient} from '../Transfer/Recipient/TransferRecipient';
import {Devices} from './Devices/Devices';
import BackupCodes from '../BackupCodes/BackupCodes';
import {cast} from '@restless/sanitizers';
import {InvalidTransferDetails} from '../../core/utils/errors';
import {Notice} from '../commons/Notice';
import {GasPrice} from '../commons/GasPrice';
import WaitingForTransfer from './WaitingForTransfer';

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
  const [dashboardOptionalArgs, setDashboardOptionalArgs] = useState<DashboardOptionalArgs>({});
  const [dashboardVisibility, setDashboardVisibility] = useState(false);

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
    try {
      setInitialTransferringState();
      const sanitizedDetails = sanitizeTransferDetails(transferDetails);
      const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(sanitizedDetails);
      const transactionHash = await waitForTransactionHash();
      setDashboardOptionalArgs(transactionHash);
      await waitToBeSuccess();
      setDashboardContent('funds');
    } catch (err) {
      setDashboardOptionalArgs({error: `${err.name}: ${err.message}`});
    }
  };

  const setInitialTransferringState = () => {
    setDashboardContent('waitingForTransfer');
    setDashboardOptionalArgs({message: 'The transaction will start in a moment'});
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
              symbol={selectedToken.symbol}
              onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
              onSendClick={onTransferSendClick}
              transferDetails={transferDetails}
            />
            <GasPrice
              isDeployed={true}
              deployedWallet={deployedWallet}
              gasLimit={DEFAULT_GAS_LIMIT}
              onGasParametersChanged={(gasParameters: GasParameters) => updateTransferDetailsWith({gasParameters})}
            />
          </div>
        );
      case 'waitingForTransfer':
        return (
          <WaitingForTransfer
            {...dashboardOptionalArgs}
            action={'Transferring funds'}
            chainName={relayerConfig!.chainSpec.name}
          />
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

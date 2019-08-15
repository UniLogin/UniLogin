import React, {useContext, useState} from 'react';
import {ApplicationWallet, TransferDetails} from '@universal-login/commons';
import UniversalLoginSDK, {TransferService} from '@universal-login/sdk';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {ConnectionNotification} from '../Notifications/ConnectionNotification';
import {ModalTransferRecipient} from '../Transfer/ModalTransferRecipient';
import {UHeader} from '../UFlow/UHeader';
import {Funds} from '../UFlow/Funds';
import {USettings} from '../UFlow/USettings';
import {useAsync} from '../hooks/useAsync';
import {TopUp} from '../TopUp/TopUp';

export interface UDashboardProps {
  sdk: UniversalLoginSDK;
  applicationWallet: ApplicationWallet;
}

export const UDashboard = ({applicationWallet, sdk}: UDashboardProps) => {
  const [transferDetalis, setTransferDetails] = useState({currency: sdk.tokensDetailsStore.tokensDetails[0].symbol} as TransferDetails);

  const modalService = useContext(ReactUModalContext);
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetalis, ...args});
  };

  const transferService = new TransferService(sdk, applicationWallet);

  switch (modalService.modalState) {
    case 'funds':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <Funds ensName={applicationWallet.name} sdk={sdk}/>
        </ModalWrapper>
      );
    case 'approveDevice':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <ConnectionNotification
            contractAddress={applicationWallet.contractAddress}
            privateKey={applicationWallet.privateKey}
            onCancel={modalService.hideModal}
            sdk={sdk}
          />
        </ModalWrapper>
      );
    case 'settings':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <USettings />
        </ModalWrapper>
      );
    case 'topup':
      return (
        <>
          <UHeader />
          <TopUp
            hideModal={modalService.hideModal}
            contractAddress={applicationWallet.contractAddress}
            onRampConfig={relayerConfig!.onRampProviders}
          />
        </>
      );
    case 'transfer':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <button onClick={() => modalService.showModal('transferRecipient')}>transfer recipient</button>
        </ModalWrapper>
      );
    case 'transferRecipient':
      const onGenerateClick = async () => {
        modalService.hideModal();
        modalService.showModal('waitingForTransfer');
        await transferService.transfer(transferDetalis);
        modalService.hideModal();
      };

      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <ModalTransferRecipient
            onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
            onSendClick={onGenerateClick}
            onBackClick={() => modalService.showModal('transferAmount')}
            transferDetalis={transferDetalis}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

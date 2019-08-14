import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {UHeader} from '../UFlow/UHeader';
import {Funds} from '../UFlow/Funds';
import {USettings} from '../UFlow/USettings';
import {useServices} from '../../core/services/useServices';
import {ConnectionNotification} from '../Notifications/ConnectionNotification';
import {ApplicationWallet} from '@universal-login/commons';
import {ChooseTopUpMethod} from '../TopUp/ChooseTopUpMethod';
import {useAsync} from '../hooks/useAsync';

export interface UDashboardProps {
  applicationWallet: ApplicationWallet;
}

export const UDashboard = ({applicationWallet}: UDashboardProps) => {
  const modalService = useContext(ReactUModalContext);
  const {sdk} = useServices();
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  switch (modalService.modalState) {
    case 'funds':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <Funds ensName={applicationWallet.name}/>
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
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <ChooseTopUpMethod
            hideModal={modalService.hideModal}
            contractAddress={applicationWallet.contractAddress}
            onRampConfig={relayerConfig!.onRampProviders}
          />
        </ModalWrapper>
      );
    case 'transfer':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          {/* <DataTransfer /> */}
        </ModalWrapper>
      );
    default:
      return null;
  }
};

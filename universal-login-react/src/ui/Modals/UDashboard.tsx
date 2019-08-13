import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {UHeader} from '../UFlow/UHeader';
import {Funds} from '../UFlow/Funds';
import {USettings} from '../UFlow/USettings';
import {useServices} from '../../core/services/useServices';
import {ConnectionNotification} from '../Notifications/NotificationConnectionWithFakes';
import {ApplicationWallet} from '@universal-login/commons';

export interface UDashboardProps {
  applicationWallet: ApplicationWallet;
}

export const UDashboard = ({applicationWallet}: UDashboardProps) => {
  const modalService = useContext(ReactUModalContext);
  const {sdk} = useServices();

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
          <div>
            topup modal
          </div>
        </ModalWrapper>
      );
    case 'transfer':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <div>
            transfer modal
          </div>
        </ModalWrapper>
      );
    default:
      return null;
  }
};

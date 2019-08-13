import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {UHeader} from '../UFlow/UHeader';
import {Funds} from '../UFlow/Funds';
import {UNotifications} from '../UFlow/UNotifications';
import {USettings} from '../UFlow/USettings';

export interface UDashboardProps {
  ensName: string;
}

export const UDashboard = ({ensName}: UDashboardProps) => {
  const modalService = useContext(ReactUModalContext);

  switch (modalService.modalState) {
    case 'funds':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <Funds ensName={ensName}/>
        </ModalWrapper>
      );
    case 'approveDevice':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <UNotifications />
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

import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';
import {UHeader} from '../UFlow/UHeader';
import {Funds} from '../UFlow/Funds';
import {ApproveDevice} from '../UFlow/ApproveDevice';
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
          <ApproveDevice />
        </ModalWrapper>
      );
    case 'settings':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <UHeader />
          <USettings />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

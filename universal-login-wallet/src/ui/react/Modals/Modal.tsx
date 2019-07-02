import React from 'react';
import ModalWrapper from './ModalWrapper';
import ModalTransfer from './ModalTransfer';
import ModalRequest from './ModalRequest';
import ModalInvitation from './ModalInvitation';
import {useSubscription, useServices} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import ModalTopUp from './ModalTopUp';
import ModalAddress from './ModalAddress';
import ModalPersonalInfo from './ModalPersonalInfo';
import ModalCardInfo from './ModalCardInfo';
import ModalWaiting from './ModalWaiting';
import ModalSafello from './ModalSafello';
import ModalWaitingForDeploy from './ModalWaitingForDeploy';

const Modal = () => {
  const {modalService} = useServices();
  const openModal = useSubscription(modalService);
  const hideModal = () => modalService.hideModal();

  switch (openModal) {
    case 'transfer':
      return (
        <ModalWrapperClosable hideModal={hideModal}>
          <ModalTransfer hideModal={hideModal}/>
        </ModalWrapperClosable>
      );
    case 'request':
      return (
        <ModalWrapperClosable hideModal={hideModal}>
          <ModalRequest />
        </ModalWrapperClosable>
      );
    case 'invitation':
      return (
        <ModalWrapperClosable hideModal={hideModal}>
          <ModalInvitation />
        </ModalWrapperClosable>
      );
    case 'topUpAccount':
      return (
        <ModalWrapper>
          <ModalTopUp />
        </ModalWrapper>
      );
    case 'address':
      return (
        <ModalWrapper>
          <ModalAddress />
        </ModalWrapper>
      );
    case 'personalInfo':
      return (
        <ModalWrapper>
          <ModalPersonalInfo />
        </ModalWrapper>
      );
    case 'cardInfo':
      return (
        <ModalWrapper>
          <ModalCardInfo />
        </ModalWrapper>
      );
    case 'waiting':
      return (
        <ModalWrapper>
          <ModalWaiting />
        </ModalWrapper>
      );
    case 'waitingForDeploy':
      return (
        <ModalWrapper>
          <ModalWaitingForDeploy />
        </ModalWrapper>
      );
    case 'safello':
      return (
        <ModalWrapper>
          <ModalSafello />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;

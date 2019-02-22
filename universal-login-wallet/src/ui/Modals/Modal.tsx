import React, {useEffect} from 'react';
import ModalWrapper from './ModalWrapper';
import ModalTransfer from './ModalTransfer';
import ModalRequest from './ModalRequest';
import ModalInvitation from './ModalInvitation';
import {KEY_CODE_ESCAPE} from 'universal-login-commons';
import {useSubscription, useServices} from '../../hooks';

const Modal = () => {
  const {modalService} = useServices();
  const openModal = useSubscription(modalService);
  const hideModal = () => modalService.hideModal();

  const listenKeyboard = (event : any) => {
    if (event.key === 'Escape' || event.keyCode === KEY_CODE_ESCAPE) {
      hideModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenKeyboard, true);
    return () => {
      window.removeEventListener('keydown', listenKeyboard, true);
    };
  });

  switch (openModal) {
    case 'transfer':
      return (
        <ModalWrapper onClose={hideModal}>
          <ModalTransfer />
        </ModalWrapper>
      );
    case 'request':
      return (
        <ModalWrapper onClose={hideModal}>
          <ModalRequest />
        </ModalWrapper>
      );
    case 'invitation':
      return (
        <ModalWrapper onClose={hideModal}>
          <ModalInvitation />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;

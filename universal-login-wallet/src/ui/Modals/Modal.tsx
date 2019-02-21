import React, {useState, useEffect} from 'react';
import ModalWrapper from './ModalWrapper';
import ModalTransfer from './ModalTransfer';
import ModalRequest from './ModalRequest';
import ModalInvitation from './ModalInvitation';
import {KEY_CODE_ESCAPE} from 'universal-login-commons';

const Modal = ({emitter}: {emitter: any}) => {
  const [openModal, setModal] = useState('');
  const closeModal = () => setModal('');

  useEffect(() => {
    const subscription = emitter.addListener('showModal', setModal);
    return () => {
      subscription.remove();
    };
  });

  const listenKeyboard = (event : any) => {
    if (event.key === 'Escape' || event.keyCode === KEY_CODE_ESCAPE) {
      closeModal();
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
        <ModalWrapper onClose={closeModal}>
          <ModalTransfer />
        </ModalWrapper>
      );
    case 'request':
      return (
        <ModalWrapper onClose={closeModal}>
          <ModalRequest />
        </ModalWrapper>
      );
    case 'invitation':
      return (
        <ModalWrapper onClose={closeModal}>
          <ModalInvitation />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;

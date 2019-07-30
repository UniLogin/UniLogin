import {useState} from 'react';
import ModalService, {ModalStateType} from './ModalService';

export const useModal = (): ModalService => {
  const [modalState, setModalState] = useState<ModalStateType>(undefined);
  return {
    modalState,
    showModal: setModalState,
    hideModal: () => setModalState('none')
  };
};

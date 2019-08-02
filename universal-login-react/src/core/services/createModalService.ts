import {useState} from 'react';

export interface IModalService<T> {
  modalState: T | 'none';
  showModal: (name: T | 'none') => void;
  hideModal: () => void;
}

export const createModalService = <T>(): IModalService<T> => {
  const [modalState, setModalState] = useState<T | 'none'>('none');
  return {
    modalState,
    showModal: setModalState,
    hideModal: () => setModalState('none')
  };
};

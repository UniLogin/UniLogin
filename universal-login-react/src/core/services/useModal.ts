import React, {useState, useContext} from 'react';

export interface IModalService<T> {
  modalState: T | 'none';
  showModal: (name: T | 'none') => void;
  hideModal: () => void;
}

export const getModalContext = <T>() => {
  return React.createContext({} as IModalService<T>);
};

export const useModal = <T>() => {
  return useContext<IModalService<T>>(getModalContext<T>());
};

export const createModalService = <T>(): IModalService<T> => {
  const [modalState, setModalState] = useState<T | 'none'>('none');
  return {
    modalState,
    showModal: setModalState,
    hideModal: () => setModalState('none')
  };
};

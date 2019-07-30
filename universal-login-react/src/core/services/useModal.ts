import React, {useState, useContext} from 'react';
import ModalService from './ModalService';

export interface IModalService {
  modalState: any;
  showModal: (name: any) => void;
  hideModal: () => void;
}

export const ModalContext = React.createContext({} as IModalService);

export const useModal = () => {
  return useContext(ModalContext);
};

export const createModalService = <T>(): ModalService<T> => {
  const [modalState, setModalState] = useState<T | undefined>(undefined);
  return {
    modalState,
    showModal: setModalState,
    hideModal: () => setModalState('none' as any as T)
  };
};

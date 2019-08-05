import {useState} from 'react';

export interface IModalService<T, K> {
  modalState: T | 'none';
  modalProps: K | {};
  showModal: (name: T | 'none', props?: K) => void;
  hideModal: () => void;
}

export const createModalService = <T, K>(): IModalService<T, K> => {
  const [modalState, setModalState] = useState<T | 'none'>('none');
  const [modalProps, setModalProps] = useState<K | 'none'>('none');
  const showModal = (modalState: T | 'none', props?: K) => {
    props ? setModalProps(props) : setModalProps('none');
    setModalState(modalState);
  };
  const hideModal = () => {
    setModalProps('none');
    setModalState('none');
  };
  return {
    modalState,
    modalProps,
    showModal,
    hideModal
  };
};

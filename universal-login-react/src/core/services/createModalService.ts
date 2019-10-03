import {useState} from 'react';

export interface IModalService<T, K> {
  modalName: T | 'none';
  modalProps: K | {};
  showModal: (name: T | 'none', props?: K) => void;
  hideModal: () => void;
}

interface IModal<T, K> {
  name: T | 'none';
  props: K | {};
}

export const createModalService = <T, K>(): IModalService<T, K> => {
  const emptyModal: IModal<T, K> = {
    name: 'none',
    props: {}
  };
  const [modal, setModal] = useState<IModal<T, K>>(emptyModal);
  const showModal = (name: T | 'none', props: K | {} = {}) => setModal({name, props});
  const hideModal = () => setModal(emptyModal);
  return {
    modalName: modal.name,
    modalProps: modal.props,
    showModal,
    hideModal
  };
};

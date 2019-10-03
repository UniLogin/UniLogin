import {useState} from 'react';

export interface IModalService<T, K> {
  modalState: T | 'none';
  modalProps: K | {};
  showModal: (name: T | 'none', props?: K) => void;
  hideModal: () => void;
}

interface IModal<T, K> {
  state: T | 'none';
  props: K | {};
}

export const createModalService = <T, K>(): IModalService<T, K> => {
  const emptyModal: IModal<T, K> = {
    state: 'none',
    props: {}
  };
  const [modal, setModal] = useState<IModal<T, K>>(emptyModal);
  const showModal = (state: T | 'none', props: K | {} = {}) => setModal({state, props});
  const hideModal = () => setModal(emptyModal);
  return {
    modalState: modal.state,
    modalProps: modal.props,
    showModal,
    hideModal
  };
};

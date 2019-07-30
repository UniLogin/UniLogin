export interface ModalService<T> {
  modalState: T | undefined;
  showModal: (modalName: T | undefined) => void;
  hideModal: () => void;
}

export default ModalService;

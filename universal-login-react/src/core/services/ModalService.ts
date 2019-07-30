export type ModalStateType = 'topUpAccount' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello' | 'none' | undefined;

export interface ModalService {
  modalState: ModalStateType;
  showModal: (modalName: ModalStateType) => void;
  hideModal: () => void;
}

export default ModalService;

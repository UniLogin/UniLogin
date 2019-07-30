export type ModalStateType = 'transfer' | 'request' | 'invitation' | 'topUpAccount' | 'address' | 'personalInfo' | 'cardInfo' | 'waiting' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none' | undefined;

export interface ModalService {
  modalState: ModalStateType;
  showModal: (modalName: ModalStateType) => void;
  hideModal: () => void;
}

export default ModalService;

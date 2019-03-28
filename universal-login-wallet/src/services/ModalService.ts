import { EventEmitter } from 'fbemitter';

export type ModalType = 'transfer' | 'request' | 'invitation' | 'topUpAccount' | 'address' | 'personalInfo' | 'cardInfo' | 'waiting' | 'none';

const MODAL_EVENT = 'modal';

class ModalService {
  private emitter = new EventEmitter();

  hideModal () {
    this.emitter.emit(MODAL_EVENT, 'none');
  }

  showModal (type: ModalType) {
    this.emitter.emit(MODAL_EVENT, type);
  }

  subscribe (callback: (type: ModalType) => void) {
    const subscription = this.emitter.addListener(MODAL_EVENT, callback);
    return function unsubscribe() {
      subscription.remove();
    };
  }
}

export default ModalService;

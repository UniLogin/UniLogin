import {EventEmitter} from 'fbemitter';

export enum TopUpModalType {
  'creditcard',
  'bank',
  'crypto',
  'none',
  'choose'
}

const MODAL_EVENT = 'topUpModal';

class TopUpModalService {
  private emitter = new EventEmitter();

  hideModal() {
    this.emitter.emit(MODAL_EVENT, 'none');
  }

  showModal(type: TopUpModalType) {
    this.emitter.emit(MODAL_EVENT, type);
  }

  subscribe(callback: (type: TopUpModalType) => void) {
    const subscription = this.emitter.addListener(MODAL_EVENT, callback);
    return function unsubscribe() {
      subscription.remove();
    };
  }
}

export default TopUpModalService;

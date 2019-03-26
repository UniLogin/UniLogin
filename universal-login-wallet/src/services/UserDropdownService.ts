import { EventEmitter } from 'fbemitter';

export type dropdownType = true | false;

const DROPDOWN_EVENT = 'userDropdown';

class UserDropdownService {
  private emitter = new EventEmitter();

  setDropdownVisibility(dropdownType: boolean) {
    this.emitter.emit(DROPDOWN_EVENT, dropdownType);
  }

  subscribe (callback: (type: dropdownType) => void) {
    const subscription = this.emitter.addListener(DROPDOWN_EVENT, callback);
    return function unsubscribe() {
      subscription.remove();
    };
  }
}

export default UserDropdownService;

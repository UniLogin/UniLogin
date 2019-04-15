import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class NotificationsPage {
  constructor(private wrapper: ReactWrapper) {}

  debug() {
    return this.wrapper.debug();
  }

  clickConfirmButton () {
    this.wrapper.find('.btn-confirm').simulate('click', { button: 0 });
  }
}

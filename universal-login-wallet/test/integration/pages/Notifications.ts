import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class NotificationsPage {
  constructor(private wrapper: ReactWrapper) {}

  debug() {
    return this.wrapper.debug();
  }

  async waitForNotificationView() {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Notifications'));
  }
}

import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class NotificationsPage {
  constructor(private wrapper: ReactWrapper) {}

  async clickConfirmButton () {
    await waitForUI(this.wrapper, () => this.wrapper.exists('.btn-confirm'));
    const button = this.wrapper.find('button.btn-confirm');
    button.simulate('click');
    await this.waitForNotificationDisappear();
  }

  async clickRejectButton () {
    const button = this.wrapper.find('button.notification-reject-btn');
    button.simulate('click');
    await this.waitForNotificationDisappear();
  }

  async waitForNotificationDisappear() {
    await waitForUI(this.wrapper, () => !this.wrapper.text().includes('unknown'));
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }
}

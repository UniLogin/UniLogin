import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class NotificationsPage {
  constructor(private wrapper: ReactWrapper) {}

  async clickConfirmButton () {
    await waitForUI(this.wrapper, () => this.wrapper.exists('#confirm'));
    this.wrapper.find('#confirm').simulate('click');
    await this.waitForNotificationDisappear();
  }

  async clickRejectButton () {
    await waitForUI(this.wrapper, () => this.wrapper.exists('#reject'));
    this.wrapper.find('#reject').simulate('click');
    await this.waitForNotificationDisappear();
  }

  async inputSecurityCode(securityCode: number[]) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Security code'));
    for (const number of securityCode) {
      const button = this.wrapper.find(`#btn-${number}`).first();
      button.simulate('click');
      await waitForUI(this.wrapper, () => this.wrapper.find(`img[alt="${number}"]`).length === 2);
    }
  }

  async waitForNotificationDisappear() {
    await waitForUI(this.wrapper, () => !this.wrapper.text().includes('Security code'));
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }
}

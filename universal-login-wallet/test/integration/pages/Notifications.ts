import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class NotificationsPage {
  constructor(private wrapper: ReactWrapper) {}

  async clickRejectButton () {
    await waitForUI(this.wrapper, () => this.wrapper.exists('#reject'));
    this.wrapper.find('#reject').simulate('click');
    await this.waitForNotificationDisappear();
  }

  async inputSecurityCode(securityCode: number[]) {
    await waitForUI(this.wrapper, () => this.wrapper.exists('#emojis'));
    for (let index = 0; index < securityCode.length; index++) {
      const number = securityCode[index];
      const button = this.wrapper.find(`#btn-${number}`).first();
      const emojiCount = this.wrapper.find('.fa').length;
      button.simulate('click');
      if (index < securityCode.length - 1) {
        await waitForUI(this.wrapper, () => this.wrapper.find('.fa').length === emojiCount + 1);
      }
      else {
        await waitForUI(this.wrapper, () => this.wrapper.exists('.connection-progress-bar'));
      }
    }
    await this.waitForNotificationDisappear();
  }

  async waitForNotificationDisappear() {
    await waitForUI(this.wrapper, () => !this.wrapper.exists('#emojis'));
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }
}

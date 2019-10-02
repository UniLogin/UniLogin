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
    for (let index = 0; index < securityCode.length; index++) {
      const number = securityCode[index];
      const button = this.wrapper.find(`#btn-${number}`).first();
      const emojiCount = this.wrapper.find('.fa').length;
      button.simulate('click');
      if (index < securityCode.length - 1) {
        await waitForUI(this.wrapper, () => this.wrapper.find('.fa').length === emojiCount + 1);
      }
      else {
        await this.waitForGasMode();
      }
    }
  }

  async waitForGasMode() {
    return waitForUI(this.wrapper, () => this.wrapper.exists('.gas-price-btn'));
  }

  selectGasMode() {
    const button = this.wrapper.find('.gas-price-btn');
    button.simulate('click');
    const fastOption = this.wrapper.find('#fast').last();
    fastOption.simulate('change');
    const feeToken = this.wrapper.find('#token-0x0000000000000000000000000000000000000000').last();
    feeToken.simulate('change');
  }

  async clickConnectDeviceButton() {
    this.wrapper.find('.connect-approve-btn').simulate('click');
    await waitForUI(this.wrapper, () => this.wrapper.exists('.connection-progress-bar'));
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

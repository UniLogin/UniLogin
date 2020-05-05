import {ReactWrapper} from 'enzyme';
import {GasModePage, waitForUI} from '@unilogin/react/testutils';

export default class NotificationsPage {
  constructor(
    private wrapper: ReactWrapper,
    private gasModePage: GasModePage,
  ) {}

  async clickRejectButton() {
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
      } else {
        await this.gasModePage.waitForGasMode();
      }
    }
  }

  selectGasMode() {
    this.gasModePage.selectGasMode();
  }

  async clickConnectDeviceButton() {
    this.wrapper.find('.footer-approve-btn').simulate('click');
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Connecting device'));
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

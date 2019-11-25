import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class DashboardPage {
  constructor(private wrapper: ReactWrapper) {
  }

  goToTransferPage() {
    this.wrapper.find('#transferFunds').simulate('click');
    this.wrapper.update();
  }

  async disconnect() {
    await this.clickDevicesButton();
    this.wrapper.find('.disconnect-account-link').simulate('click');
    this.wrapper.find('#username').simulate('change', {target: {value: 'super-name.mylogin.eth'}});
    this.wrapper.find('#verifyField').simulate('change', {target: {value: 'DISCONNECT'}});
    this.wrapper.find('.disconnect-account-confirm').simulate('click');
  }

  async waitForHideModal() {
    await waitForUI(this.wrapper, () => !this.wrapper.exists('.modal-wrapper'), 4000);
  }

  getWalletBalance(): string {
    return this.wrapper.find('p.balance-amount').text();
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }

  async clickDevicesButton() {
    this.wrapper.find('#devicesButton').first().simulate('click', {button: 0});
    await waitForUI(this.wrapper, () => this.wrapper.exists('div.devices'));
  }

  async clickManageDevicesButton() {
    this.wrapper.find('button.devices-message-button').simulate('click', {button: 0});
    await waitForUI(this.wrapper, () => this.wrapper.exists('#emojis'));
  }

  async waitForNewNotifications() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('.new-notifications'), 3000, 100);
  }

  async waitForWelcomeScreen() {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Welcome in the Jarvis Network'));
  }

  async waitForDashboard() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('p.balance-amount'));
  }
}

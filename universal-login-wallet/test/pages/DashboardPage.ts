import {ReactWrapper} from 'enzyme';
import {waitForUI} from '@unilogin/react/testutils';

export default class DashboardPage {
  constructor(private wrapper: ReactWrapper) {
  }

  goToTransferPage() {
    this.wrapper.find('#transferFunds.unilogin-component-primary-button').simulate('click');
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
    await waitForUI(this.wrapper, () => !this.wrapper.exists('.unilogin-component-modal-wrapper'), 4000);
    await this.waitForDashboard();
  }

  async closeModal() {
    this.wrapper.find('.close-button').simulate('click');
    return this.waitForHideModal();
  }

  getWalletBalance(): string {
    return this.wrapper.find('p.balance-amount').text();
  }

  async waitForBalanceUpdate(currentBalance: string) {
    await waitForUI(this.wrapper, () => this.wrapper.find('p.balance-amount').text() !== currentBalance, 4000);
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }

  async clickDevicesButton() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('#devicesButton'));
    this.wrapper.find('#devicesButton').first().simulate('click', {button: 0});
    await waitForUI(this.wrapper, () => this.wrapper.exists('div.unilogin-component-devices'));
  }

  async clickManageDevicesButton() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('button.devices-message-button'));
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

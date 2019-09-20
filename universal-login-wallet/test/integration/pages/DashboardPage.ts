import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class DashboardPage {
  constructor(private wrapper : ReactWrapper) {
  }

  clickTransferButton() {
    this.wrapper.find('#transferFunds').simulate('click');
    this.wrapper.update();
  }

  disconnect() {
    this.wrapper.find('.sign-out-btn').simulate('click');
  }

  async waitForHideModal() {
    await waitForUI(this.wrapper, () => !this.wrapper.exists('.modal-wrapper'), 4000);
  }

  getWalletBalance() : string {
    return this.wrapper.find('span.balance-amount-highlighted').text();
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }

  async clickNotificationButton() {
    this.wrapper.find('#notificationsButton').simulate('click', { button: 0 });
    await waitForUI(this.wrapper, () => this.wrapper.exists('#emojis'));
  }

  async waitForNewNotifications() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('.new-notifications'), 3000, 100);
  }
}

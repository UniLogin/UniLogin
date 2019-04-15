import {ReactWrapper} from 'enzyme';
import {Contract} from 'ethers';
import {sleep} from '@universal-login/commons';
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

  async getBalance(mockTokenContract : Contract, walletAddress: string) {
    // TODO: walletAddress Should be taken from UI
    await sleep(300);
    const tokenBalance = await mockTokenContract.balanceOf(walletAddress);
    return tokenBalance.toString();
  }

  getWalletBalance() : string {
    return this.wrapper.find('span.balance-amount-highlighted').text();
  }

  isNotificationAlert(): boolean {
    this.wrapper.update();
    return this.wrapper.exists('.new-notifications');
  }

  async clickNotificationButton() {
    this.wrapper.find('a#notificationsLink').simulate('click', { button: 0 });
    // console.log(this.wrapper.debug())
    // await waitForUI(this.wrapper, () => this.wrapper.text().includes('Notifications'));
  }

  async waitForNewNotifications() {
    await waitForUI(this.wrapper, () => this.wrapper.exists('.new-notifications'), 1000);
  }
}

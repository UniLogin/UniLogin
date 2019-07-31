import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';
import {getSuggestionId} from '@universal-login/commons';

export default class LoginPage {

  constructor(private wrapper: ReactWrapper) {
  }

  clickCreateOne() {
    this.wrapper.find('.welcome-box-create').last().simulate('click');
  }

  clickConnectToExisting() {
    this.wrapper.find('.welcome-box-connect').last().simulate('click');
  }

  approveTerms() {
    this.wrapper.find('.checkbox').childAt(0).simulate('change');
    this.wrapper.find('button.terms-btn').last().simulate('click');
  }

  async pickUsername(userName: string, action: string, result: string) {
    const input = this.wrapper.find('input');
    input.simulate('change', {target: {value: userName}});
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(action));
    this.wrapper.find(`#${getSuggestionId(action)}`).simulate('click');
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(result));
  }

  async createNew(userName: string) {
    await this.pickUsername(userName, 'create new', 'Choose a top-up method');
  }

  async connect(userName: string) {
    await this.pickUsername(userName, 'connect to existing', 'Connect with another device');
  }

  clickConnectWithAnotherDevice() {
    this.wrapper.find('.connection-method-link[href="/connect-with-emoji"]').simulate('click', {button: 0});
  }

  chooseTopUpMethod() {
    this.wrapper.find('#topup-btn-crypto').simulate('click');
   }

  getAddress() {
    return this.wrapper.find('#contract-address').prop('defaultValue');
  }

  async waitAndGoToWallet(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Go to your wallet'), timeout);
    this.wrapper.find('a.button-secondary').simulate('click', {button: 0});
  }
  async waitForEmojiView(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Thanks, now check another device controling this account and enter the emojis in this order:'), timeout);
  }

  async waitForHomeView(balance: string, timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(`balance${balance}`), timeout);
  }
}

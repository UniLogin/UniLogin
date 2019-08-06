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
    await this.pickUsername(userName, 'create new', 'Type amount of ether you want to buy');
  }

  async connect(userName: string) {
    await this.pickUsername(userName, 'connect to existing', 'Connect with another device');
  }

  async waitForHomeView(balance: string, timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(`Balance${balance}`), timeout);
  }
}

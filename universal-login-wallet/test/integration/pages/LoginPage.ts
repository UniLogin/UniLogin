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
    this.wrapper.find('#terms-label').childAt(0).simulate('change');
    this.wrapper.find('#privacy-label').childAt(0).simulate('change');
    this.wrapper.find('button.terms-btn').last().simulate('click');
  }

  async pickUsername(userName: string, action: string, result: string) {
    const input = this.wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {target: {value: userName}});
    await this.clickAction(action);
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(result));
  }

  async clickAction(action: string) {
    await waitForUI(this.wrapper, () => this.wrapper.exists(`#${getSuggestionId(action)}`));
    this.wrapper.find(`#${getSuggestionId(action)}`).simulate('click');
  }

  async createNew(userName: string) {
    await this.pickUsername(userName, 'create new', 'Choose a top-up method');
  }

  async connect(userName: string) {
    await this.pickUsername(userName, 'connect', 'Connect with another device');
  }

  async waitForHomeView(balance: string, timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(`Balance${balance}`), timeout);
  }
}

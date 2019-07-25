import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';
import {getSuggestionId} from '@universal-login/commons';

export default class LoginPage {

  constructor(private wrapper: ReactWrapper) {
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
    await this.pickUsername(userName, 'connect to existing', 'Waiting for approval');
  }

  async chooseTopUpMethod() {
    await this.wrapper.find('#topup-btn-crypto').simulate('click');
  }

  getAddress() {
    return this.wrapper.find('span#contract-address').text();
  }

  async waitForHomeView(balance: string, timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes(`balance${balance}`), timeout);
  }
}

import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../utils/utils';
import {Wallet, utils} from 'ethers';

export default class LoginPage {

  constructor(private wrapper : ReactWrapper) {
  }

  async pickUsername(userName : string) {
    const input = this.wrapper.find('input');
    input.simulate('change', {target: {value: userName}});
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('create new'));
    this.wrapper.find('.suggestions-item-btn').simulate('click');
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Transfer one of following'));
  }

  getAddress() {
    return this.wrapper.find('.input-copy').props().defaultValue as string;
  }

  async waitForHomeView() {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Your balance'));
  }
}

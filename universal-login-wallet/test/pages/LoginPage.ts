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

  async topUp(wallet: Wallet) {
    const address = this.wrapper.find('.input-copy').props().defaultValue as string;
    await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Your balance'), 3000);
  }
}

import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class CreationFlow {

  constructor(private wrapper: ReactWrapper) {
  }

  chooseTopUpMethod() {
    const input = this.wrapper.find('input.input-topup-amount');
    input.simulate('change', {target: {value: '1'}});
    this.wrapper.find('.button-topup-amount').simulate('click');
    this.wrapper.update();
    this.wrapper.find('#topup-btn-crypto').simulate('click');
   }

  getAddress() {
    return this.wrapper.find('#contract-address').prop('defaultValue');
  }

  async waitAndGoToWallet(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Go to your wallet'), timeout);
    this.wrapper.find('a.button-secondary').simulate('click', {button: 0});
  }
}

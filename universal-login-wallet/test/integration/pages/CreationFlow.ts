import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class CreationFlow {

  constructor(private wrapper: ReactWrapper) {
  }

  chooseTopUpMethod() {
    this.wrapper.find('label#topup-btn-crypto').simulate('click');
   }

  getAddress() {
    return this.wrapper.find('#contract-address').prop('defaultValue');
  }

  async waitAndGoToWallet(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Go to your wallet'), timeout);
    this.wrapper.find('a.button-secondary').simulate('click', {button: 0});
  }
}

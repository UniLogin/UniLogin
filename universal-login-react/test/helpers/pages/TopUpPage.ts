import {BasePage} from './BasePage';
import {TopUp} from '../../../src';

export class TopUpPage extends BasePage {
  isProperPage() {
    this.wrapper.update();
    return this.wrapper.exists(TopUp);
  }

  chooseCryptoMethod() {
    this.wrapper.find('label#topup-btn-crypto').simulate('click');
  }

  getAddress() {
    return this.wrapper.find('.unilogin-component-input').prop('defaultValue');
  }

  getMinimalAmount() {
    const minimalAmountRegex = /Send at least ([0-9.]+)/g;
    const [, minimalAmount] = minimalAmountRegex.exec(this.wrapper.text());
    return minimalAmount;
  }
};

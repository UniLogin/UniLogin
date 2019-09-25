import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class TransferPage {
  constructor(private appWrapper: ReactWrapper) {
  }

  async chooseCurrency(currency: string) {
    await waitForUI(this.appWrapper, () => this.appWrapper.find('button.currency-accordion-item').length !== 0);
    this.appWrapper.find('button.currency-accordion-btn').simulate('click');
    const items = this.appWrapper.find('button.currency-accordion-item');
    items.filterWhere(item => item.text().includes(currency)).first().simulate('click');
  }

  transfer() {
    this.appWrapper.find('#send-button').first().simulate('click');
  }

  enterTransferAmount(amount: string) {
    this.appWrapper.find('#max-button').simulate('click');
    const amountInput = this.appWrapper.find('input#amount-eth');
    amountInput.simulate('change', {target: {value: amount}});
    this.clickSelectRecipient();
  }

  enterRecipient(address: string) {
    const addressInput = this.appWrapper.find('input#input-recipient');
    addressInput.simulate('change', {target: {value: address}});
  }

  clickSelectRecipient() {
    this.appWrapper.find('#select-recipient').simulate('click');
  }

  clickMaxAmountButton() {
    this.appWrapper.find('#max-button').simulate('click');
  }
}

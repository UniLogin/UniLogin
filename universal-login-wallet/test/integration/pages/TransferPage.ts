import {ReactWrapper} from 'enzyme';

export default class TransferPage {
  constructor(private appWrapper: ReactWrapper) {
  }

  chooseCurrency(currency: string) {
    this.appWrapper.find('button.currency-accordion-btn').simulate('click');
    const items = this.appWrapper.find('button.currency-accordion-item');
    items.filterWhere(item => item.text().includes(currency)).first().simulate('click');
  }

  transfer() {
    this.appWrapper.find('#send-button').first().simulate('click');
  }

  enterTransferAmount(amount: string) {
    const amountInput = this.appWrapper.find('input#amount-eth');
    amountInput.simulate('change', {target: {value: amount}});
    this.appWrapper.find('#select-recipient').simulate('click');
  }

  enterRecipient(address: string) {
    const addressInput = this.appWrapper.find('input#input-recipient');
    addressInput.simulate('change', {target: {value: address}});
  }
}

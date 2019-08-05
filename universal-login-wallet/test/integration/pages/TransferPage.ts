import {ReactWrapper} from 'enzyme';

export default class TransferPage {
  constructor(private appWrapper: ReactWrapper) {
  }

  enterTransferDetails(address: string, value: string) {
    const addressInput = this.appWrapper.find('.input-transfer-modal-address');
    const amountInput = this.appWrapper.find('.input-with-dropdown-transfer-modal-amount');

    addressInput.simulate('change', {target: {value: address}});
    amountInput.simulate('change', {target: {value}});
  }

  chooseCurrency(currency: string) {
    this.appWrapper.find('.currency-dropdown-btn').simulate('click');
    const items = this.appWrapper.find('.currency-item-btn');
    items.filterWhere(item => item.text().includes(currency)).simulate('click');
  }

  transfer() {
    this.appWrapper.find('#transferButton').first().simulate('click');
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

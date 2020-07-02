import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../waitForUI';
import {GasModePage} from './GasModePage';

export class TransferPage {
  constructor(
    private wrapper: ReactWrapper,
    readonly gasModePage = new GasModePage(wrapper),
  ) {}

  async chooseCurrency(currency: string) {
    await waitForUI(this.wrapper, () => this.wrapper.find('button.currency-accordion-item').length !== 0);
    this.wrapper.find('button.currency-accordion-btn').simulate('click');
    const items = this.wrapper.find('button.currency-accordion-item');
    items.filterWhere(item => item.text().includes(currency)).first().simulate('click');
  }

  transfer() {
    this.wrapper.find('#send-button').first().simulate('click');
  }

  async doesAmountErrorExists() {
    await waitForUI(this.wrapper, () => this.wrapper.find('.transfer-amount-hint').exists());
    return this.wrapper.find('.transfer-amount-hint').exists();
  }

  async doesRecipientErrorExists() {
    await waitForUI(this.wrapper, () => this.wrapper.find('.transfer-recipient-hint').exists());
    return this.wrapper.find('.transfer-recipient-hint').exists();
  }

  enterTransferAmount(amount: string) {
    const amountInput = this.wrapper.find('input#amount-eth');
    amountInput.simulate('change', {target: {value: amount}});
  }

  enterRecipient(address: string) {
    const addressInput = this.wrapper.find('input#input-recipient');
    addressInput.simulate('change', {target: {value: address}});
  }

  getErrorMessage() {
    this.wrapper.update();
    return this.wrapper.find('.error-message-text').text();
  }

  selectGasMode() {
    return this.gasModePage.selectGasMode();
  }

  waitForGasMode() {
    return this.gasModePage.waitForGasMode();
  }

  async waitForBalance() {
    await waitForUI(this.wrapper, () => this.wrapper.find('.assets-balance').exists());
  }
}

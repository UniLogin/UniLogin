import { ReactWrapper } from 'enzyme';

export default class TransferPage {
  constructor(private appWrapper : ReactWrapper) {
  }

  enterTransferDetails(address: string, value: string) {
    const addressInput = this.appWrapper.find('.input-transfer-modal-address');
    const amountInput = this.appWrapper.find('.input-with-dropdown-transfer-modal-amount');

    addressInput.simulate('change', {target: {value: address}});
    amountInput.simulate('change', {target: {value}});

    this.appWrapper.find('#transferButton').first().simulate('click');
  }
}

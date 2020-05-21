import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../waitForUI';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

export class GasModePage {
  constructor(private wrapper: ReactWrapper) {}

  isRendered() {
    return this.wrapper.exists('.gas-price-btn');
  }

  async waitForGasMode() {
    return waitForUI(this.wrapper, () => this.isRendered());
  }

  selectGasMode(tokenAddress = ETHER_NATIVE_TOKEN.address) {
    const button = this.wrapper.find('.gas-price-btn');
    button.simulate('click');
    const fastOption = this.wrapper.find('#fast').last();
    fastOption.simulate('change');
    const feeToken = this.wrapper.find(`#token-${tokenAddress}`).last();
    feeToken.simulate('click');
  }
}

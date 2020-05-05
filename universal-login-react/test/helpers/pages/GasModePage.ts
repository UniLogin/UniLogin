import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../waitForUI';

export class GasModePage {
  constructor(private wrapper: ReactWrapper) {}

  isRendered() {
    return this.wrapper.exists('.gas-price-btn');
  }

  async waitForGasMode() {
    return waitForUI(this.wrapper, () => this.isRendered());
  }

  selectGasMode() {
    const button = this.wrapper.find('.gas-price-btn');
    button.simulate('click');
    const fastOption = this.wrapper.find('#fast').last();
    fastOption.simulate('change');
    const feeToken = this.wrapper.find('#token-0x0000000000000000000000000000000000000000').last();
    feeToken.simulate('change');
  }
}

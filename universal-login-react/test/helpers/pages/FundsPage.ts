import {ReactWrapper} from 'enzyme';

export class FundsPage {
  constructor(private wrapper: ReactWrapper) {}

  getUsdBalance() {
    this.wrapper.update();
    return this.wrapper.find('.balance-amount').text();
  }
}

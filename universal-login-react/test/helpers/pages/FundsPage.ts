import {ReactWrapper} from 'enzyme';

export class FundsPage {
  constructor(private wrapper: ReactWrapper) {}

  getUsdBalance() {
    return this.wrapper.find('.universal-login-balance-amount').text();
  }
}

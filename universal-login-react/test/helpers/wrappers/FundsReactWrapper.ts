import {ReactWrapper} from 'enzyme';

export class FundsReactWrapper {
  constructor(private wrapper: ReactWrapper) {}

  getUsdBalance() {
    return this.wrapper.find('.universal-login-balance-amount').text();
  }
}

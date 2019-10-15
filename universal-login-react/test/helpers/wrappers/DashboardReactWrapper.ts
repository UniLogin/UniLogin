import {ReactWrapper} from 'enzyme';
import {FundsReactWrapper} from './FundsReactWrapper';

export class DashboardReactWrapper {
  private fundsWrapper?: FundsReactWrapper;

  constructor(private wrapper: ReactWrapper) {}

  funds(): FundsReactWrapper {
    this.fundsWrapper = this.fundsWrapper || new FundsReactWrapper(this.wrapper);
    return this.fundsWrapper;
  }

  clickInitButton() {
    const uButton = this.wrapper.find('.udashboard-logo-btn');
    uButton.simulate('click');
  }
}


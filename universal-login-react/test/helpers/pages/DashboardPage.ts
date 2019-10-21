import {ReactWrapper} from 'enzyme';
import {FundsPage} from './FundsPage';

export class DashboardPage {
  private fundsPage?: FundsPage;

  constructor(private wrapper: ReactWrapper) {}

  funds(): FundsPage {
    this.fundsPage = this.fundsPage || new FundsPage(this.wrapper);
    return this.fundsPage;
  }

  clickInitButton() {
    const uButton = this.wrapper.find('.udashboard-logo-btn');
    uButton.simulate('click');
  }
}

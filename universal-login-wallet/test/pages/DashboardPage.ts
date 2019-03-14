import {ReactWrapper} from 'enzyme';

export default class DashboardPage {
  constructor(private wrapper : ReactWrapper) {
  }

  clickTransferButton() {
    this.wrapper.find('.transfer-funds-button').simulate('click');
    this.wrapper.update();
  }
}

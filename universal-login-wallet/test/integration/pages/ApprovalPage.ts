import {ReactWrapper} from 'enzyme';

export default class ApprovalPage {
  constructor(private wrapper: ReactWrapper) {}

  clickCancel() {
    const button = this.wrapper.find('a.btn-text');

    console.log(this.wrapper.debug());
  }
}

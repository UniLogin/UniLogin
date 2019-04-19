import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class ApprovalPage {
  constructor(private wrapper: ReactWrapper) {}

  async clickCancel() {
    const button = this.wrapper.find('a.btn-text');
    button.simulate('click', {button: 0});
    await waitForUI(this.wrapper, () => this.wrapper.exists('Login'), 2000);
  }
}

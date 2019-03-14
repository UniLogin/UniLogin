import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../utils/utils';

export default class LoginPage {

  constructor(private appWrapper : ReactWrapper) {
  }

  async pickUsername(userName : string) {
    const input = this.appWrapper.find('input');
    input.simulate('change', {target: {value: userName}});
    await waitForUI(this.appWrapper, () => this.appWrapper.text().includes('create new'));
    this.appWrapper.find('.suggestions-item-btn').simulate('click');
    await waitForUI(this.appWrapper, () => this.appWrapper.text().includes('Your balance'));
  }
}

import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../helpers/utils';

export default class ConnectionFlow {

  constructor(private wrapper: ReactWrapper) {
  }

  clickConnectWithAnotherDevice() {
    this.wrapper.find('#emoji').simulate('click');
  }

  async waitForEmojiView(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Thanks, now check another device controling this account and enter the emojis in this order:'), timeout);
  }
}

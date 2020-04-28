import {ReactWrapper} from 'enzyme';
import {waitForUI} from '@unilogin/react/testutils';

export default class ConnectionFlow {
  constructor(private wrapper: ReactWrapper) {
  }

  clickConnectWithAnotherDevice() {
    this.wrapper.find('#emoji').simulate('click');
  }

  clickCancel() {
    this.wrapper.find('.cancel-emoji-btn').simulate('click');
  }

  async waitForEmojiView(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.html().includes('emoji-panel-list'), timeout);
  }

  async waitForConnectionChoiceView(timeout?: number) {
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Connect with another device'), timeout);
  }
}

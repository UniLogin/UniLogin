import {BasePage} from './BasePage';
import {waitForUI} from '../..';
import {ChooseTopUpToken} from '../../../src';

export class ChooseTopUpTokenPage extends BasePage {
  isProperPage() {
    this.wrapper.update();
    return this.wrapper.exists(ChooseTopUpToken);
  };

  async pickTopUpToken(token = 'ETH') {
    this.wrapper.find(`#top-up-token-${token}`).simulate('click', {button: 0});
    await waitForUI(this.wrapper, () => this.wrapper.text().includes('Choose a top-up method'));
  };
}

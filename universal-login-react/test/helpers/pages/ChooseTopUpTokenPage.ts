import {BasePage} from './BasePage';
import {ChooseTopUpToken} from '../../../src';
import {TopUpPage} from './TopUpPage';

export class ChooseTopUpTokenPage extends BasePage {
  isProperPage() {
    this.wrapper.update();
    return this.wrapper.exists(ChooseTopUpToken);
  };

  pickTopUpToken(token = 'ETH') {
    this.wrapper.find(`#top-up-token-${token}`).simulate('click', {button: 0});
    return new TopUpPage(this.wrapper);
  };
}

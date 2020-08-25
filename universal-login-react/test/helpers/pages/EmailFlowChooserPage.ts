import {BasePage} from './BasePage';
import {ConfirmCodePage} from './ConfirmCodePage';

export class EmailFowChooserPage extends BasePage {
  typeEnsName(name: string) {
    return this.type('ens-name-input', name);
  }

  typeEmail(email: string) {
    return this.type('email-input', email);
  }

  confirm() {
    this.wrapper.find('button.unilogin-component-confirm-btn').simulate('click');
    return new ConfirmCodePage(this.wrapper);
  }
}

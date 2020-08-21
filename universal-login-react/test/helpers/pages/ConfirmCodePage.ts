import {BasePage} from './BasePage';
import {ConfirmCode} from '../../../src/ui/Onboarding/ConfirmCode';
import {PrimaryButton} from '../../../src/ui/commons/Buttons/PrimaryButton';
import {CreatePasswordPage} from './CreatePasswordPage';

export class ConfirmCodePage extends BasePage {
  isProperPage() {
    return this.wrapper.exists(ConfirmCode);
  }

  confirmCode(code: string) {
    const signs = code.split('');
    for (const id in signs) {
      const input = this.wrapper.find(`input[data-id=${id}]`);
      input.simulate('change', {target: {value: signs[id], dataset: {id}}});
    }

    this.clickConfirm();
    return new CreatePasswordPage(this.wrapper);
  }

  clickConfirm() {
    const button = this.wrapper.find(PrimaryButton);
    button.simulate('click');
  }
}

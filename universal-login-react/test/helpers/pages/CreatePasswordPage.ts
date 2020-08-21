import {BasePage} from './BasePage';
import {CreatePassword} from '../../../src/ui/Onboarding/CreatePassword';
import {PrimaryButton} from '../../../src/ui/commons/Buttons/PrimaryButton';
import {ChooseTopUpTokenPage} from './ChooseTopUpTokenPage';

export class CreatePasswordPage extends BasePage {
  isProperPage() {
    this.wrapper.update();
    return this.wrapper.exists(CreatePassword);
  };

  enterPassword(password: string) {
    this.type('password-input', password);
    this.type('password-input-confirmation', password);
  }

  submit() {
    const button = this.wrapper.find(PrimaryButton);
    button.simulate('click');
    return new ChooseTopUpTokenPage(this.wrapper);
  }
}

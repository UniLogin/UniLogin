import {BasePage} from './BasePage';
import {CreatePassword} from '../../../src/ui/Onboarding/CreatePassword';

export class CreatePasswordPage extends BasePage {
  isProperPage() {
    this.wrapper.update();
    return this.wrapper.exists(CreatePassword);
  };
}

import {BasePage} from './BasePage';
import {ConfirmCode} from '../../../src/ui/Onboarding/ConfirmCode';

export class ConfirmCodePage extends BasePage {
  isProperPage() {
    return this.wrapper.contains(ConfirmCode);
  }
}

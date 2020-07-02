import {ReactWrapper} from 'enzyme';
import {waitForUI} from '../waitForUI';
import {SuggestionOperationType} from '../../../src/core/models/SuggestionProps';
import {getSuggestionId} from '../../../src';

export class WalletSelectorPage {
  constructor(private wrapper: ReactWrapper) {}

  typeName(name: string) {
    const input = this.wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', {target: {value: name}});
  }

  async waitForSuggestions() {
    return waitForUI(this.wrapper, () => this.wrapper.exists('.unilogin-component-suggestions-group'));
  }

  selectSuggestion(action: SuggestionOperationType) {
    const button = this.wrapper.find(`#${getSuggestionId(action)}`).first();
    button.simulate('click');
  }
}

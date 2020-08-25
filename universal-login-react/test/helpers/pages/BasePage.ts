import {ReactWrapper} from 'enzyme';

export abstract class BasePage {
  constructor(protected wrapper: ReactWrapper) {}

  protected type(id: string, value: string) {
    const input = this.wrapper.find(`input#${id}`);
    input.simulate('focus');
    input.simulate('change', {target: {value: value}});
  }

  debug() {
    return this.wrapper.debug();
  }
}

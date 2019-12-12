import {ReactWrapper} from 'enzyme';

export class Web3PickerPage {
  constructor(
    private appWrapper: ReactWrapper,
  ) {}

  select(provider: string) {
  }

  isOpen() {
    this.appWrapper.update();
    return this.appWrapper.text().includes('How would you like to connect to blockchain?');
  }
}

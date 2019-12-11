import {ReactWrapper} from 'enzyme';

export class Web3PickerPage {
  constructor(
    private appWrapper: ReactWrapper,
  ) {}

  select(provider: string) {
  }

  isOpen() {
    this.appWrapper.update()
    console.log(this.appWrapper.debug())
    return this.appWrapper.text().includes('Choose provider');
  }
}
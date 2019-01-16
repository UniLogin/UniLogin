import {utils} from 'ethers';
import Clicker from '../../build/Clicker';

class ClickService {
  constructor(identityService, addresses, defaultPaymentOptions) {
    this.identityService = identityService;
    this.addresses = addresses;
    this.defaultPaymentOptions = defaultPaymentOptions;
  }

  async click(callback) {
    const message = {
      to: this.addresses.clicker,
      from: this.identityService.identity.address,
      value: 0,
      data: new utils.Interface(Clicker.interface).functions.press.encode([]),
      gasToken: this.addresses.token,
      ...this.defaultPaymentOptions
    };
    await this.identityService.execute(message);
    callback();
  }
}

export default ClickService;

import {utils} from 'ethers';
import Clicker from '../../build/Clicker';

class ClickService {
  constructor(identityService, addressess, defaultPaymentOptions) {
    this.identityService = identityService;
    this.addressess = addressess;
    this.defaultPaymentOptions = defaultPaymentOptions;
  }

  async click(callback) {
    const message = {
      to: this.addressess.clicker,
      from: this.identityService.identity.address,
      value: 0,
      data: new utils.Interface(Clicker.interface).functions.press.encode([]),
      gasToken: this.addressess.token,
      ...this.defaultPaymentOptions
    };
    await this.identityService.execute(message);
    callback();
  }
}

export default ClickService;

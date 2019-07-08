import {utils} from 'ethers';
import Clicker from '../../build/Clicker';

class ClickService {
  constructor(walletContractService, addresses, defaultPaymentOptions) {
    this.walletContractService = walletContractService;
    this.addresses = addresses;
    this.defaultPaymentOptions = defaultPaymentOptions;
  }

  async click(callback) {
    const message = {
      to: this.addresses.clicker,
      from: this.walletContractService.walletContract.address,
      value: 0,
      data: new utils.Interface(Clicker.interface).functions.press.encode([]),
      gasToken: this.addresses.token,
      ...this.defaultPaymentOptions
    };
    const {waitForMined} = await this.walletContractService.execute(message);
    await waitForMined();
    callback();
  }
}

export default ClickService;

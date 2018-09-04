import ethers from 'ethers';
import Clicker from '../../build/Clicker';

class ClickerService {
  constructor(identityService, clickerContractAddress, provider) {
    this.identityService = identityService;
    this.clickerContractAddress = clickerContractAddress;
    this.provider = provider;
    this.clickerContract = new ethers.Contract(this.clickerContractAddress, Clicker.interface, this.provider);
  }

  async click() {
    const message = { 
      to: this.clickerContractAddress,
      value: 0,
      data: this.clickerContract.interface.functions.press().data
    };
    await this.identityService.execute(message);
  }


  async getLastClick() {
    return await this.clickerContract.lastPressed();
  }
}

export default ClickerService;
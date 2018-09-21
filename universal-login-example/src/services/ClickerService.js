import ethers, {Interface} from 'ethers';
import Clicker from '../../build/Clicker';

class ClickerService {
  constructor(identityService, clickerContractAddress, provider, ensService) {
    this.identityService = identityService;
    this.clickerContractAddress = clickerContractAddress;
    this.provider = provider;
    this.clickerContract = new ethers.Contract(this.clickerContractAddress, Clicker.interface, this.provider);
    this.event = new Interface(Clicker.interface).events.ButtonPress;
    this.ensService = ensService;
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

  getTimeDistanceInWords(timeA, timeB) {
    return Math.floor(timeA - timeB);
  }

  async getEnsName(address) {
    return await this.ensService.getEnsName(address);
  }

  async getEventsFromLogs(events) {
    let pressers = [];
    for (const event of events) {
      const eventArguments = this.event.parse(this.event.topics, event.data);
      pressers.push({
        address: await this.getEnsName(eventArguments.presser),
        pressTime: this.getTimeDistanceInWords(Date.now()/1000,parseInt(eventArguments.pressTime)),
        score: parseInt(eventArguments.score),
        key: event.data
      });
    }
    return pressers.reverse();
  }

  async getPressEvents() {
    const filter = {fromBlock: 0, address: this.clickerContractAddress, topics: [this.event.topics]};
    const events = await this.provider.getLogs(filter);
    return this.getEventsFromLogs(events);
  }
}

export default ClickerService;
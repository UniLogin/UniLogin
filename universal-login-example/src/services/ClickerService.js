import {Contract, utils} from 'ethers';
import Clicker from '../../build/Clicker';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {OPERATION_CALL} from 'universal-login-contracts';
import {sleep} from '../utils';

class ClickerService {
  constructor(identityService, clickerContractAddress, provider, ensService, tokenContractAddress, defaultPaymentOptions) {
    this.identityService = identityService;
    this.clickerContractAddress = clickerContractAddress;
    this.provider = provider;
    this.tokenContractAddress = tokenContractAddress;
    this.defaultPaymentOptions = defaultPaymentOptions;
    this.clickerContract = new Contract(
      this.clickerContractAddress,
      Clicker.interface,
      this.provider
    );
    this.interface = new utils.Interface(Clicker.interface);
    this.event = new utils.Interface(Clicker.interface).events.ButtonPress;
    this.ensService = ensService;
    this.lastLogs = [];
    this.pressers = [];
  }

  async click() {
    const message = {
      to: this.clickerContractAddress,
      from: this.identityService.identity.address,
      value: 0,
      data: this.clickerContract.interface.functions.press.encode([]),
      gasToken: this.tokenContractAddress,
      operationType: OPERATION_CALL,
      ...this.defaultPaymentOptions
    };
    await this.identityService.execute(message);
  }

  async getLastClick() {
    return await this.clickerContract.lastPressed();
  }

  getTimeDistanceInWords(time) {
    const date = new Date(time * 1000);
    return distanceInWordsToNow(date, {includeSeconds: true});
  }

  async getEnsName(address) {
    return await this.ensService.getEnsName(address);
  }

  async getPressersFromLogs(events) {
    const pressers = [];
    for (const event of events) {
      const eventArguments = this.interface.parseLog(event).values;
      pressers.push({
        address: eventArguments.presser,
        name: eventArguments.presser,
        pressTime: this.getTimeDistanceInWords(
          parseInt(eventArguments.pressTime, 10)
        ),
        score: parseInt(eventArguments.score, 10),
        key: event.data
      });
    }
    this.pressers = pressers.reverse().concat(this.pressers);
  }

  async getPressLogs() {
    const filter = {
      fromBlock: 0,
      address: this.clickerContractAddress,
      topics: [this.event.topic]
    };
    this.pressersLogs = await this.provider.getLogs(filter);
  }

  async pressersTranslator(pressers) {
    let count = 0;
    for (const presser of pressers) {
      if (presser.name.slice(0, 2) === '0x') {
        this.pressers[count].name = await this.getEnsName(presser.address);
      }
      count++;
    }
  }

  async pressersUpdate(callback, timeout = 5000) {
    if (this.doUpdate) {
      await this.getPressLogs();
      if (this.pressersLogs.length > 0 && this.lastLogs.length !== this.pressersLogs.length) {
        await this.getPressersFromLogs(this.pressersLogs.slice(this.lastLogs.length));
        this.pressersTranslator(this.pressers.slice(0, (this.pressersLogs.length - this.lastLogs.length)));
        this.lastLogs = this.pressersLogs;
        callback({lastClick: this.pressers[0].pressTime, events: this.pressers});
      } 
      await sleep(timeout);
    }
  }

  startUpdate() {
    this.doUpdate = true;
  }

  stopUpdate() {
    this.doUpdate = false;
  }
}

export default ClickerService;

import {Contract, utils} from 'ethers';
import Clicker from '../../build/Clicker';
import {sleep} from '../../src/relayer/utils';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {OPERATION_CALL} from 'universal-login-contracts';

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
    this.running = false;
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

  subscribe(callback) {
    this.running = true;
    this.loop(callback);
  }

  async loop(callback, tick = 1000) {
    do {
      const events = await this.getPressEvents();
      callback(events);
      await sleep(tick);
    } while (this.running);
  }

  unsubscribeAll() {
    this.running = false;
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

  async getEventFormLogs(event) {
    const eventArguments = this.interface.parseLog(event).values;
    return {
      address: eventArguments.presser,
      name: await this.getEnsName(eventArguments.presser),
      pressTime: this.getTimeDistanceInWords(
        parseInt(eventArguments.pressTime, 10)
      ),
      score: parseInt(eventArguments.score, 10),
      key: event.data
    };
  }

  async getEventsFromLogs(events) {
    const pressers = [];
    for (const event of events) {
      pressers.push(await this.getEventFormLogs(event));
    }
    return pressers.reverse();
  }

  async getPressLogs() {
    const filter = {
      fromBlock: 0,
      address: this.clickerContractAddress,
      topics: [this.event.topic]
    };
    return await this.provider.getLogs(filter);
  }

  async getPressEvents() {
    return this.getEventsFromLogs(await this.getPressLogs());
  }
}

export default ClickerService;

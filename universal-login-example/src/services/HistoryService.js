import {Contract, utils} from 'ethers';
import Clicker from '../../build/Clicker';
import {sleep} from '../../src/relayer/utils';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {OPERATION_CALL} from 'universal-login-contracts';

class HistoryService {
  constructor(clickerContractAddress, provider, ensService) {
    this.clickerContractAddress = clickerContractAddress;
    this.provider = provider;
    this.ensService = ensService;
    this.interface = new utils.Interface(Clicker.interface);
    this.pressButtonTopic = new utils.Interface(Clicker.interface).events.ButtonPress.topic;
    this.running = false;
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
      topics: [this.pressButtonTopic]
    };
    return await this.provider.getLogs(filter);
  }

  async getPressEvents() {
    return this.getEventsFromLogs(await this.getPressLogs());
  }
}

export default HistoryService;

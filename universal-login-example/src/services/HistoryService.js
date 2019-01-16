import {utils} from 'ethers';
import Clicker from '../../build/Clicker';
import {sleep} from '../utils';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

class HistoryService {
  constructor(clickerContractAddress, provider) {
    this.clickerContractAddress = clickerContractAddress;
    this.provider = provider;
    this.interface = new utils.Interface(Clicker.interface);
    this.pressButtonTopic = new utils.Interface(Clicker.interface).events.ButtonPress.topic;
    this.running = false;
    this.pressers = [];
  }

  getTimeDistanceInWords(time) {
    const date = new Date(time * 1000);
    return distanceInWordsToNow(date, {includeSeconds: true});
  }

  async getEnsName(address) {
    return await this.ensService.getEnsName(address);
  }

  subscribe(callback, tick = 500) {
    this.running = true;
    this.loop(callback, tick);
  }

  async calculateResult() {
    await this.getPressEvents();
    const events = [...this.pressers].reverse();
    return {
      loaded: true,
      events,
      lastClick: events.length > 0 ? events[0].pressTime : '0'
    };
  }

  async loop(callback, tick = 500) {
    do {
      await callback(await this.calculateResult());
      await sleep(tick);
    } while (this.running);
  }

  unsubscribeAll() {
    this.running = false;
  }

  getEventFormLogs(event) {
    const eventArguments = this.interface.parseLog(event).values;
    return {
      address: eventArguments.presser,
      name: eventArguments.presser,
      pressTime: this.getTimeDistanceInWords(
        parseInt(eventArguments.pressTime, 10)
      ),
      score: parseInt(eventArguments.score, 10),
      key: event.data
    };
  }

  async getEventsFromLogs(events) {
    for (const event of events) {
      this.pressers.push(this.getEventFormLogs(event));
    }
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
    const newEvents = await this.getPressLogs();
    if (newEvents.length !== this.pressers.length) {
      await this.getEventsFromLogs(newEvents.slice(this.pressers.length));
    }
  }
}

export default HistoryService;

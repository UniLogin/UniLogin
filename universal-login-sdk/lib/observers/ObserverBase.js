import {sleep} from '../utils/utils';
import {EventEmitter} from 'fbemitter';

class ObserverBase {
  constructor() {
    this.state = 'stop';
    this.step = 1000;
    this.emitters = [];
  }

  subscribe(eventType, filter, callback) {
    if (filter.key) { 
      filter.key = filter.key.toLowerCase();
    }
    const filterString = JSON.stringify(filter);
    const emitter = this.emitters[filterString] || new EventEmitter();
    this.emitters[filterString] = emitter;
    return emitter.addListener(eventType, callback);
  }

  async start() {
    if (this.state === 'stop') {
      this.state = 'running';
      this.loop();
    }
  }

  async loop() {
    if (this.state === 'stop') {
      return;
    }
    await this.tick();
    if (this.state === 'stopping') {
      this.state = 'stop';
    } else {
      setTimeout(this.loop.bind(this), this.step);
    }
  }

  stop() {
    this.state = 'stop';
  }

  async finalizeAndStop() {
    this.state = 'stopping';
    do {
      await sleep(this.step);
    } while (this.state !== 'stop');
  }
}

export default ObserverBase;

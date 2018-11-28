import {sleep} from '../utils/utils';
import {EventEmitter} from 'fbemitter';

class ObserverBase {
  constructor() {
    this.state = 'stop';
    this.step = 1000;
    this.emitters = {};
  }

  subscribe(eventType, filter, callback) {
    let emitter;      
    emitter = this.emitters[filter.contractAddress] || new EventEmitter();
    this.emitters[filter.contractAddress] = emitter;
    if (filter.key) {
      this.emitters[filter.contractAddress] ? this.emitters[filter.contractAddress] : this.emitters[filter.contractAddress] = {};
      emitter = this.emitters[filter.contractAddress][filter.key] || new EventEmitter();
      this.emitters[filter.contractAddress][filter.key] = emitter;
    }
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

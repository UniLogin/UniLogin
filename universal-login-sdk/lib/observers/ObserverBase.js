import {sleep} from '../utils/utils';
import {EventEmitter} from 'fbemitter';

class ObserverBase {
  constructor() {
    this.state = 'stop';
    this.step = 1000;
    this.emitters = {};
  }

  subscribe(eventType, identityAddress, callback) {
    const emitter = this.emitters[identityAddress] || new EventEmitter();
    this.emitters[identityAddress] = emitter;
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

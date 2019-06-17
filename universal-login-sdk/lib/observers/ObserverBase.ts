import {sleep} from '@universal-login/commons';
import {EventEmitter} from 'fbemitter';

type ObserverBaseState = 'stop' | 'stopping' | 'running';

abstract class ObserverBase {
  protected state: ObserverBaseState = 'stop';
  step = 1000;
  protected emitters: Record<string, EventEmitter> = {};

  subscribe(eventType: string, filter: any, callback: Function) {
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

  abstract async tick(): Promise<void>;

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
    } while (this.isRunning());
  }

  protected isRunning() {
    return this.state !== 'stop';
  }
}

export default ObserverBase;

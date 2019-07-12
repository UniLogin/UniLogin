import {EventEmitter} from 'fbemitter';
import ObserverRunner from './ObserverRunner';

abstract class ObserverBase extends ObserverRunner {
  protected emitters: Record<string, EventEmitter> = {};

  subscribe(eventType: string, filter: any, callback: Function) {
    if (filter.key) {
      filter.key = filter.key.toLowerCase();
    }
    const filterString = JSON.stringify(filter);
    const emitter = this.emitters[filterString] || new EventEmitter();
    this.emitters[filterString] = emitter;
    const token = emitter.addListener(eventType, callback);
    // return token;
    return this.unsubscribe(token, filterString);
  }

  unsubscribe(token: any, filterString: string) {
    return {
      remove: () => {
        delete this.emitters[filterString];
        token.remove();
      }
    };
  }
}

export default ObserverBase;

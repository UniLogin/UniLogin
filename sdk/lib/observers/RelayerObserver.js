import ObserverBase from './ObserverBase';
import {diffIndexAuthorisationsArray} from '../utils/authorisationUtils';

class RelayerObserver extends ObserverBase {
  constructor(relayerUrl, provider) {
    super();
    this.provider = provider;
    this.relayerUrl = relayerUrl;
    this.pendingAuthorisationsIndexes = {};
    this.emitters = {};
    this.pendingAuthorisationsIndexes = {};
    this.index = 0;
    this.step = 1000;
    this.state = 'stop';
  }

  subscribe(eventType, identityAddress, callback) {
    const emitter = this.emitters[identityAddress] || new EventEmitter();
    this.emitters[identityAddress] = emitter;
    emitter.addListener(eventType, callback);
    this.pendingAuthorisationsIndexes[identityAddress] = [];
  }

  start() {
    if (this.state === 'stop') {
      this.state = 'running';
      this.loop();
    }
  }

  loop() {
    if (this.state === 'stop') {
      return;
    }
    await this.checkAuthorisationRequests();
    if (this.state === 'stopping') {
      this.state = 'stop';
    } else {
      setTimeout(this.loop.bind(this), this.step);
    }
  }

  async checkAuthorisationRequests() {
    for (const identityAddress of Object.keys(this.emitters)) {
      const emitter = this.emitters[identityAddress];
      const authorisations = await this.getPendingAuthorisations(identityAddress);
      const diffIndexes = diffIndexAuthorisationsArray(this.pendingAuthorisationsIndexes[identityAddress], authorisations);
      this.pendingAuthorisationsIndexes[identityAddress] = this.pendingAuthorisationsIndexes[identityAddress].concat(diffIndexes);
      for (const index of diffIndexes) {
        for (const authorisation of authorisations) {
          if (authorisation.index === index) {
            emitter.emit('AuthorisationsChanged', authorisation);
          }
        }
      }
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

export default RelayerObserver;

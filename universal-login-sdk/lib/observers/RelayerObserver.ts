import ObserverBase from './ObserverBase';
import {RelayerApi} from '../RelayerApi';
import deepEqual from 'deep-equal';


class RelayerObserver extends ObserverBase {
  lastAuthorisations: any = {};
  constructor(private relayerApi: RelayerApi) {
    super();
  }

  async tick() {
    return this.checkAuthorisationRequests();
  }

  async checkAuthorisationsChangedFor(filter: string) {
    const {contractAddress} = JSON.parse(filter);
    const emitter = this.emitters[filter as any];
    const authorisations = await this.fetchPendingAuthorisations(contractAddress);
    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      this.lastAuthorisations = authorisations;
      emitter.emit('AuthorisationsChanged', authorisations);
    }
  }

  async checkAuthorisationRequests() {
    for (const filter of Object.keys(this.emitters)) {
      await this.checkAuthorisationsChangedFor(filter);
    }
  }

  async fetchPendingAuthorisations(contractAddress: string) {
    const {response} = await this.relayerApi.getPendingAuthorisations(contractAddress);
    return response;
  }
}

export default RelayerObserver;

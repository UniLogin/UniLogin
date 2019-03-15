import ObserverBase from './ObserverBase';
import {headers, fetch} from '../utils/fetch';
import deepEqual from 'deep-equal';


class RelayerObserver extends ObserverBase {
  lastAuthorisations: any = {};
  constructor(private relayerUrl: string) {
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

  authorisationUrl(contractAddress: string) {
    return `${this.relayerUrl}/authorisation/${contractAddress}`;
  }

  async fetchPendingAuthorisations(contractAddress: string) {
    const url = this.authorisationUrl(contractAddress);
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    const responseJson = await response.json();
    if (response.status === 200) {
      return responseJson.response;
    }
    throw new Error(`${response.status}`);
  }
}

export default RelayerObserver;

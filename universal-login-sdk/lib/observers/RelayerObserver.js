import ObserverBase from './ObserverBase';
import {headers, fetch} from '../utils/http';
import deepEqual from 'deep-equal';


class RelayerObserver extends ObserverBase {
  constructor(relayerUrl) {
    super();
    this.relayerUrl = relayerUrl;
    this.lastAuthorisations = {};
  }

  async tick() {
    return this.checkAuthorisationRequests();
  }

  async checkAuthorisationsChangedFor(filter) {
    const {contractAddress} = JSON.parse(filter);
    const emitter = this.emitters[filter];
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

  authorisationUrl(contractAddress) {
    return `${this.relayerUrl}/authorisation/${contractAddress}`;
  }

  async fetchPendingAuthorisations(contractAddress) {
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

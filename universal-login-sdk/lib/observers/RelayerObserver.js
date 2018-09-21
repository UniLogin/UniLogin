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

  async checkAuthorisationsChangedFor(identityAddress) {
    const emitter = this.emitters[identityAddress];
    const authorisations = await this.fetchPendingAuthorisations(identityAddress);
    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      this.lastAuthorisations = authorisations;
      emitter.emit('AuthorisationsChanged', authorisations);
    }
  }

  async checkAuthorisationRequests() {
    for (const identityAddress of Object.keys(this.emitters)) {
      await this.checkAuthorisationsChangedFor(identityAddress);
    }
  }

  authorisationUrl(identityAddress) {
    return `${this.relayerUrl}/authorisation/${identityAddress}`;
  }

  async fetchPendingAuthorisations(identityAddress) {
    const url = this.authorisationUrl(identityAddress);
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

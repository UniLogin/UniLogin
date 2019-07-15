import {RelayerApi} from '../RelayerApi';
import deepEqual from 'deep-equal';
import ObserverRunner from './ObserverRunner';
import {ensure, Notification, GetAuthorisationRequest} from '@universal-login/commons';
import {ConcurrentAuthorisation} from '../utils/errors';

class AuthorisationsObserver extends ObserverRunner {
  private lastAuthorisations: Notification[] = [];
  private getAuthorisationRequest?: GetAuthorisationRequest;
  private callbacks: Function[] = [];

  constructor(private relayerApi: RelayerApi) {
    super();
  }

  async tick() {
    return this.checkAuthorisationsChangedFor(this.getAuthorisationRequest!);
  }

  private async checkAuthorisationsChangedFor(getAuthorisationRequest: GetAuthorisationRequest) {
    const authorisations = await this.fetchPendingAuthorisations(getAuthorisationRequest);

    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      this.lastAuthorisations = authorisations;
      for (const callback of this.callbacks) {
        callback(authorisations);
      }
    }
  }

  private async fetchPendingAuthorisations(getAuthorisationRequest: GetAuthorisationRequest) {
    const {response} = await this.relayerApi.getPendingAuthorisations(getAuthorisationRequest);
    return response;
  }

  subscribe(getAuthorisationRequest: GetAuthorisationRequest, callback: Function) {
    ensure(
      !this.getAuthorisationRequest ||
      (this.getAuthorisationRequest.walletContractAddress === getAuthorisationRequest.walletContractAddress),
      ConcurrentAuthorisation
    );

    callback(this.lastAuthorisations);
    this.getAuthorisationRequest = getAuthorisationRequest;
    this.callbacks.push(callback);
    if (!this.isRunning()) {
      this.start();
    }

    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.getAuthorisationRequest = undefined;
        this.lastAuthorisations = [];
        this.stop();
      }
    };
  }
}

export default AuthorisationsObserver;

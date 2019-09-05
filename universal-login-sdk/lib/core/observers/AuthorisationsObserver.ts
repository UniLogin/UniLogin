import {RelayerApi} from '../../integration/http/RelayerApi';
import deepEqual from 'deep-equal';
import ObserverRunner from './ObserverRunner';
import {ensure, Notification, AuthorisationRequest} from '@universal-login/commons';
import {ConcurrentAuthorisation} from '../utils/errors';

class AuthorisationsObserver extends ObserverRunner {
  private lastAuthorisations: Notification[] = [];
  private authorisationRequest?: AuthorisationRequest;
  private callbacks: Function[] = [];

  constructor(private relayerApi: RelayerApi, tick: number = 1000) {
    super();
    this.tick = tick;
  }

  async execute() {
    return this.checkAuthorisationsChangedFor(this.authorisationRequest!);
  }

  private async checkAuthorisationsChangedFor(authorisationRequest: AuthorisationRequest) {
    const authorisations = await this.fetchPendingAuthorisations(authorisationRequest);
    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      this.lastAuthorisations = authorisations;
      for (const callback of this.callbacks) {
        callback(authorisations);
      }
    }
  }

  private async fetchPendingAuthorisations(authorisationRequest: AuthorisationRequest) {
    const {response} = await this.relayerApi.getPendingAuthorisations(authorisationRequest);
    return response;
  }

  subscribe(authorisationRequest: AuthorisationRequest, callback: Function) {
    ensure(
      !this.authorisationRequest ||
      (this.authorisationRequest.contractAddress === authorisationRequest.contractAddress),
      ConcurrentAuthorisation
    );

    callback(this.lastAuthorisations);
    this.authorisationRequest = authorisationRequest;
    this.callbacks.push(callback);
    if (this.isStopped()) {
      this.start();
    }

    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.authorisationRequest = undefined;
        this.lastAuthorisations = [];
        this.stop();
      }
    };
  }
}

export default AuthorisationsObserver;

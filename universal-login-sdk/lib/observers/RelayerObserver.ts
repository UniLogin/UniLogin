import {RelayerApi} from '../RelayerApi';
import deepEqual from 'deep-equal';
import ObserverRunner from './ObserverRunner';
import {ensure, Notification} from '@universal-login/commons';
import {ConcurrentAuthorisation} from '../utils/errors';

class RelayerObserver extends ObserverRunner {
  private lastAuthorisations: Notification[] = [];
  private contracAddress?: string;
  private callback?: Function;

  constructor(private relayerApi: RelayerApi) {
    super();
  }

  async tick() {
    return this.checkAuthorisationsChangedFor(this.contracAddress!);
  }

  private async checkAuthorisationsChangedFor(contractAddress: string) {
    const authorisations = await this.fetchPendingAuthorisations(contractAddress.toLowerCase());
    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      this.lastAuthorisations = authorisations;
      this.callback!(authorisations);
    }
  }

  private async fetchPendingAuthorisations(contractAddress: string) {
    const {response} = await this.relayerApi.getPendingAuthorisations(contractAddress);
    return response;
  }

  subscribeAndStart(contractAddress: string, callback: Function) {
    this.subscribe(contractAddress, callback);
    this.start();
    return () => {
      this.contracAddress = undefined;
      this.lastAuthorisations = [];
      this.stop();
    };
  }

  subscribe(contractAddress: string, callback: Function) {
    ensure(!this.isRunning(), ConcurrentAuthorisation);
    this.contracAddress = contractAddress;
    this.callback = callback;
  }
}

export default RelayerObserver;

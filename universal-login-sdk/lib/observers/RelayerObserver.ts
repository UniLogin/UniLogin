import {RelayerApi} from '../RelayerApi';
import deepEqual from 'deep-equal';
import ObserverRunner from './ObserverRunner';
import {ensure, Notification, GetAuthorisationRequest} from '@universal-login/commons';

class RelayerObserver extends ObserverRunner {
  private lastAuthorisations: Notification[] = [];
  private contractAddress?: string;
  private callbacks: Function[] = [];

  constructor(private relayerApi: RelayerApi) {
    super();
  }

  async tick() {
    return this.checkAuthorisationsChangedFor(this.contractAddress!);
  }

  private async checkAuthorisationsChangedFor(contractAddress: string) {
    const authorisations = await this.fetchPendingAuthorisations(contractAddress.toLowerCase());
    // const {contractAddress, signature} = JSON.parse(filter);
    // const getAuthorisationRequest: GetAuthorisationRequest = {
    //   walletContractAddress: contractAddress,
    //   signature
    // };
    // const emitter = this.emitters[filter as any];
    // const authorisations = await this.fetchPendingAuthorisations(getAuthorisationRequest);
    if (!deepEqual(authorisations, this.lastAuthorisations)) {
      // console.log('emit event');
      // console.log(authorisations);
      // console.log(this.lastAuthorisations);
      this.lastAuthorisations = authorisations;
      for (const callback of this.callbacks) {
        callback(authorisations);
      }
    }
  }

  private async fetchPendingAuthorisations(contractAddress: string) {
    const {response} = await this.relayerApi.getPendingAuthorisations(contractAddress);
    return response;
  }

  subscribe(contractAddress: string, callback: Function) {
    ensure(!this.contractAddress || (this.contractAddress === contractAddress), ConcurrentAuthorisation);
    callback(this.lastAuthorisations);
    this.contractAddress = contractAddress;
    this.callbacks.push(callback);
    if (!this.isRunning()) {
      this.start();
    }
    return () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.contractAddress = undefined;
        this.lastAuthorisations = [];
        this.stop();
      }
    };
  }
}

export default RelayerObserver;

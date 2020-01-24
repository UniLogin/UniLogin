import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {ensureNotNull, Nullable} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';
import {Callback} from 'reactive-properties/dist/Property';
import {BlockNumberService} from '../services/BlockNumberService';

class WalletEventsObserverFactory {
  protected observers: Record<string, WalletEventsObserver> = {};
  private unsubscribe: Nullable<Callback> = null;

  constructor(private blockchainService: BlockchainService, private blockNumberService: BlockNumberService) {
  }

  async start() {
    this.blockNumberService.set(await this.blockchainService.getBlockNumber());
    this.unsubscribe = this.blockNumberService.subscribe(() => this.fetchEvents());
  }

  async fetchEvents() {
    ensureNotNull(this.blockNumberService.get(), InvalidObserverState);
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved', 'AddedOwner', 'RemovedOwner']);
  }

  async fetchEventsOfTypes(types: WalletEventType[]) {
    ensureNotNull(this.blockNumberService.get(), InvalidObserverState);
    for (const contractAddress of Object.keys(this.observers)) {
      await this.observers[contractAddress].fetchEvents(this.blockNumberService.get(), types);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    this.observers[filter.contractAddress] = this.observers[filter.contractAddress] || new WalletEventsObserver(filter.contractAddress, this.blockchainService);
    const observableRecord = {key: filter.key, callback};
    return this.observers[filter.contractAddress].subscribe(eventType, observableRecord);
  }

  stop() {
    ensureNotNull(this.unsubscribe, InvalidObserverState);
    this.unsubscribe();
  }

  async finalizeAndStop() {
    this.stop();
  }
}

export default WalletEventsObserverFactory;

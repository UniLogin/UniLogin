import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {Callback} from 'reactive-properties';
import {ensureNotNullish, Nullable, ProviderService} from '@unilogin/commons';
import {InvalidObserverState} from '../utils/errors';
import {NewBlockObserver} from './NewBlockObserver';

class WalletEventsObserverFactory {
  protected observers: Record<string, WalletEventsObserver> = {};
  private unsubscribe: Nullable<Callback> = null;

  constructor(
    private providerService: ProviderService,
    private newBlockObserver: NewBlockObserver,
  ) {
  }

  async start() {
    this.unsubscribe = await this.newBlockObserver.subscribe((blockNumber: number) => this.fetchEvents(blockNumber));
  }

  async fetchEvents(blockNumber: number) {
    if (Object.keys(this.observers).length === 0) {
      return;
    }
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved', 'AddedOwner', 'RemovedOwner'], blockNumber);
  }

  async fetchEventsOfTypes(types: WalletEventType[], blockNumber: number) {
    for (const contractAddress of Object.keys(this.observers)) {
      await this.observers[contractAddress].fetchEvents(blockNumber, types);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    this.observers[filter.contractAddress] = this.observers[filter.contractAddress] || new WalletEventsObserver(filter.contractAddress, this.providerService);
    const observableRecord = {key: filter.key, callback};
    const unsubscribe = this.observers[filter.contractAddress].subscribe(eventType, observableRecord);
    this.newBlockObserver.callCallbacks();
    return unsubscribe;
  }

  stop() {
    ensureNotNullish(this.unsubscribe, InvalidObserverState);
    this.unsubscribe();
    this.unsubscribe = null;
  }

  finalizeAndStop() {
    this.stop();
  }
}

export default WalletEventsObserverFactory;

import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {ensureNotNull, Nullable} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';
import {Callback} from 'reactive-properties/dist/Property';
import {BlockNumberState} from '../states/BlockNumberState';
import {IStorageService} from '../models/IStorageService';
import {StorageEntry} from '../services/StorageEntry';
import {MemoryStorageService} from '../services/MemoryStorageService';
import {asNumber} from '@restless/sanitizers';

const STORAGE_KEY = 'LAST_BLOCK_NUMBER';

class WalletEventsObserverFactory {
  protected observers: Record<string, WalletEventsObserver> = {};
  private unsubscribe: Nullable<Callback> = null;
  storage: StorageEntry<number>;

  constructor(
    private blockchainService: BlockchainService,
    private blockNumberState: BlockNumberState,
    storageService: IStorageService = new MemoryStorageService(),
  ) {
    this.storage = new StorageEntry(STORAGE_KEY, asNumber, storageService);
  }

  async start() {
    this.blockNumberState.set(await this.blockchainService.getBlockNumber());
    this.unsubscribe = this.blockNumberState.subscribe(() => this.fetchEvents());
  }

  async fetchEvents() {
    ensureNotNull(this.blockNumberState.get(), InvalidObserverState);
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved', 'AddedOwner', 'RemovedOwner']);
  }

  async fetchEventsOfTypes(types: WalletEventType[]) {
    ensureNotNull(this.blockNumberState.get(), InvalidObserverState);
    for (const contractAddress of Object.keys(this.observers)) {
      await this.observers[contractAddress].fetchEvents(this.blockNumberState.get(), types);
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

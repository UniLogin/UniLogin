import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {BlockNumberState} from '../states/BlockNumberState';
import {ensureNotNull, Nullable} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';
import {Callback} from 'reactive-properties/dist/Property';

class WalletEventsObserverFactory {
  protected observers: Record<string, WalletEventsObserver> = {};
  private unsubscribe: Nullable<Callback> = null;

  constructor(private blockchainService: BlockchainService, private currentBlock: BlockNumberState) {
  }

  async start() {
    this.currentBlock.set(await this.blockchainService.getBlockNumber());
    this.unsubscribe = this.currentBlock.subscribe(() => this.fetchEvents());
  }

  async fetchEvents() {
    ensureNotNull(this.currentBlock.get(), InvalidObserverState);
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved', 'AddedOwner', 'RemovedOwner']);
  }

  async fetchEventsOfTypes(types: WalletEventType[]) {
    ensureNotNull(this.currentBlock.get(), InvalidObserverState);
    for (const contractAddress of Object.keys(this.observers)) {
      await this.observers[contractAddress].fetchEvents(this.currentBlock.get(), types);
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

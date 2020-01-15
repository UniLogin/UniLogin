import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {BlockProperty} from '../properties/BlockProperty';
import ObserverRunner from './ObserverRunner';
import {ensureNotNull} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';

class WalletEventsObserverFactory extends ObserverRunner {
  protected observers: Record<string, WalletEventsObserver> = {};

  constructor(private blockchainService: BlockchainService, private currentBlock: BlockProperty) {
    super();
  }

  async start() {
    this.currentBlock.set(await this.blockchainService.getBlockNumber());
    super.start();
  }

  async execute() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    ensureNotNull(this.currentBlock.get(), InvalidObserverState);
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved']);
    this.currentBlock.set(await this.blockchainService.getBlockNumber());
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
}

export default WalletEventsObserverFactory;

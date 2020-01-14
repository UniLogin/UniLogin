import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import {BlockProperty} from '../properties/BlockProperty';
import ObserverRunner from './ObserverRunner';
import {Nullable, ensureNotNull} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';

class WalletEventsObserverFactory extends ObserverRunner {
  protected observers: Record<string, WalletEventsObserver> = {};

  private lastBlock: Nullable<number> = null;

  constructor(private blockchainService: BlockchainService, private currentBlock: BlockProperty) {
    super();
  }

  async start() {
    this.lastBlock = await this.blockchainService.getBlockNumber();
    super.start();
  }

  async execute() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    ensureNotNull(this.lastBlock, InvalidObserverState);
    await this.fetchEventsOfTypes(['KeyAdded', 'KeyRemoved']);
    this.lastBlock = await this.blockchainService.getBlockNumber();
  }

  async fetchEventsOfTypes(types: WalletEventType[]) {
    ensureNotNull(this.lastBlock, InvalidObserverState);
    for (const contractAddress of Object.keys(this.observers)) {
      await this.observers[contractAddress].fetchEvents(this.lastBlock!, types);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    this.observers[filter.contractAddress] = this.observers[filter.contractAddress] || new WalletEventsObserver(filter.contractAddress, this.blockchainService);
    const observableRecord = {key: filter.key, callback};
    return this.observers[filter.contractAddress].subscribe(eventType, observableRecord);
  }
}

export default WalletEventsObserverFactory;

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
    await super.start();
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
    for (const publicKey of Object.keys(this.observers)) {
      await this.observers[publicKey].fetchEvents(publicKey, this.lastBlock!, types);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    this.observers[filter.key] = this.observers[filter.key] || new WalletEventsObserver(filter.contractAddress, this.blockchainService);
    return this.observers[filter.key].subscribe(eventType, callback);
  }
}

export default WalletEventsObserverFactory;

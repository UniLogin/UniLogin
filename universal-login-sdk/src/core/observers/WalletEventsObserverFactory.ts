import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import ObserverRunner from './ObserverRunner';
import {Nullable, ensureNotNull} from '@universal-login/commons';
import {InvalidObserverState} from '../utils/errors';

class WalletEventsObserverFactory extends ObserverRunner {
  protected observers: Record<string, WalletEventsObserver> = {};

  private lastBlock: Nullable<number> = null;

  constructor(private blockchainService: BlockchainService) {
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
    for (const observer of Object.keys(this.observers)) {
      await this.observers[observer].fetchEvents(observer, this.lastBlock!, types);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    const observer = this.observers[filter.key] || new WalletEventsObserver(filter.contractAddress, this.blockchainService);
    this.observers[filter.key] = observer;
    return observer.subscribe(eventType, callback);
  }
}

export default WalletEventsObserverFactory;

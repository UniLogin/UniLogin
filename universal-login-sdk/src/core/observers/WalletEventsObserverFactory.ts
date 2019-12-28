import {BlockchainService} from '@universal-login/contracts';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import ObserverRunner from './ObserverRunner';

class WalletEventsObserverFactory extends ObserverRunner {
  protected observers: Record<string, WalletEventsObserver> = {};

  private lastBlock?: number;

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
    await this.fetchEventsOfType('KeyAdded');
    await this.fetchEventsOfType('KeyRemoved');
    this.lastBlock = await this.blockchainService.getBlockNumber();
  }

  async fetchEventsOfType(type: WalletEventType) {
    for (const observer of Object.keys(this.observers)) {
      this.observers[observer].fetchEvents(observer, this.lastBlock!, type);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    const observer = this.observers[filter.key] || new WalletEventsObserver(filter.contractAddress, this.blockchainService);
    this.observers[filter.key] = observer;
    return observer.subscribe(eventType, callback);
  }
}

export default WalletEventsObserverFactory;

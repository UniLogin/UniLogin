import {BlockchainService, WalletContractInterface} from '@universal-login/contracts';
import {Log} from 'ethers/providers';
import {WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {WalletEventsObserver} from './WalletEventsObserver';
import ObserverRunner from './ObserverRunner';

const eventInterface = WalletContractInterface.events;

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
    const topics = [eventInterface[type].topic];
    for (const observer of Object.keys(this.observers)) {
      const filter = JSON.parse(observer);
      const eventsFilter = {fromBlock: this.lastBlock, address: filter.contractAddress, topics};
      const events: Log[] = await this.blockchainService.getLogs(eventsFilter);
      this.observers[observer].processEvents(events, filter, type);
    }
  }

  subscribe(eventType: WalletEventType, filter: WalletEventFilter, callback: WalletEventCallback) {
    const filterString = JSON.stringify(filter);
    const observer = this.observers[filterString] || new WalletEventsObserver(filter.contractAddress);
    this.observers[filterString] = observer;
    return observer.subscribe(eventType, callback);
  }
}

export default WalletEventsObserverFactory;

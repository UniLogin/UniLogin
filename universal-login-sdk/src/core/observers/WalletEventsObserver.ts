import {arrayRemove} from '@universal-login/commons';
import {WalletEventArgs, WalletEventCallback, WalletEventType} from '../models/events';
import {parseArgs} from '../utils/events';
import {Log} from 'ethers/providers';
import {WalletContractInterface, BlockchainService} from '@universal-login/contracts';

const eventInterface = WalletContractInterface.events;

export class WalletEventsObserver {
  private readonly callbacks: Record<WalletEventType, WalletEventCallback[]> = {
    KeyAdded: [],
    KeyRemoved: [],
  };

  constructor(public readonly contractAddress: string, public readonly blockchainService: BlockchainService) {
  }

  subscribe(type: WalletEventType, callback: WalletEventCallback) {
    this.callbacks[type].push(callback);
    return () => {
      this.callbacks[type] = arrayRemove(this.callbacks[type], callback);
    };
  }

  emit(type: WalletEventType, args: WalletEventArgs) {
    for (const callback of this.callbacks[type]) {
      callback(args);
    }
  }

  async fetchEvents(key: string, lastBlock: number, types: WalletEventType[]) {
    for (const type of types) {
      const topics = [eventInterface[type].topic];
      const eventsFilter = {fromBlock: lastBlock, address: this.contractAddress, topics};
      const events: Log[] = await this.blockchainService.getLogs(eventsFilter);
      this.processEvents(events, key, type);
    }
  }

  processEvents(events: Log[], filterKey: string, type: WalletEventType) {
    for (const event of events) {
      const {key} = parseArgs(type, event);
      if (filterKey === 'undefined' || filterKey === key) {
        this.emit(type, parseArgs(type, event));
      }
    }
  }
}

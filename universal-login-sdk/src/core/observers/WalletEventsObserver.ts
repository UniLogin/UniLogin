import {arrayRemove} from '@unilogin/commons';
import {WalletEventType, WalletEventObservableRecord} from '../models/events';
import {parseArgs, eventInterface, parseArgsGnosis} from '../utils/events';
import {Log} from 'ethers/providers';
import {BlockchainService} from '@unilogin/contracts';

export class WalletEventsObserver {
  private readonly observableRecords: Record<WalletEventType, WalletEventObservableRecord[]> = {
    KeyAdded: [],
    KeyRemoved: [],
    AddedOwner: [],
    RemovedOwner: [],
  };

  constructor(public readonly contractAddress: string, public readonly blockchainService: BlockchainService) {
  }

  subscribe(type: WalletEventType, observableRecord: WalletEventObservableRecord) {
    this.observableRecords[type].push(observableRecord);
    return () => {
      this.observableRecords[type] = arrayRemove(this.observableRecords[type], observableRecord);
    };
  }

  async fetchEvents(lastBlock: number, types: WalletEventType[]) {
    for (const type of types) {
      const topics = [eventInterface[type].topic];
      const eventsFilter = {fromBlock: lastBlock, address: this.contractAddress, topics};
      const events: Log[] = await this.blockchainService.getLogs(eventsFilter);
      this.processEvents(events, type);
    }
  }

  processEvents(events: Log[], type: WalletEventType) {
    for (const event of events) {
      this.processEvent(type, event);
    }
  }

  private processEvent(type: WalletEventType, event: Log) {
    let args: {key: string};
    switch (type) {
      case 'KeyAdded':
      case 'KeyRemoved':
        args = parseArgs(type, event);
        break;
      case 'AddedOwner':
      case 'RemovedOwner':
        args = parseArgsGnosis(type, event);
        break;
      default:
        throw TypeError(`Invalid event type: ${type}`);
    };
    for (const observableRecord of this.observableRecords[type]) {
      if (observableRecord.key === 'undefined' || observableRecord.key === args.key) {
        observableRecord.callback(args);
      }
    }
  }
}

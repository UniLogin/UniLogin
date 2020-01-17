import {arrayRemove} from '@universal-login/commons';
import {WalletEventType, WalletEventObservableRecord} from '../models/events';
import {parseArgs} from '../utils/events';
import {Log} from 'ethers/providers';
import {WalletContractInterface, BlockchainService, GnosisSafeInterface} from '@universal-login/contracts';

const eventInterface = {...WalletContractInterface.events, ...GnosisSafeInterface.events};

export class WalletEventsObserver {
  private readonly observableRecords: Record<WalletEventType, WalletEventObservableRecord[]> = {
    KeyAdded: [],
    KeyRemoved: [],
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
    const args = parseArgs(type, event);
    for (const observableRecord of this.observableRecords[type]) {
      if (observableRecord.key === 'undefined' || observableRecord.key === args.key) {
        observableRecord.callback(args);
      }
    }
  }
}

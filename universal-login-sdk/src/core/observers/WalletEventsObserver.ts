import {arrayRemove} from '@universal-login/commons';
import {WalletEventArgs, WalletEventCallback, WalletEventFilter, WalletEventType} from '../models/events';
import {parseArgs} from '../utils/events';
import {Log} from 'ethers/providers';

export class WalletEventsObserver {
  private readonly callbacks: Record<WalletEventType, WalletEventCallback[]> = {
    KeyAdded: [],
    KeyRemoved: [],
  };

  constructor(public readonly contractAddress: string) {
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

  processEvents(events: Log[], filter: WalletEventFilter, type: WalletEventType) {
    for (const event of events) {
      const {key} = parseArgs(type, event);
      if (filter.key === 'undefined' || filter.key === key) {
        this.emit(type, parseArgs(type, event));
      }
    }
  }
}

import blocknativeSdk from 'bnc-sdk';
import {API} from 'bnc-sdk/dist/types/src/interfaces';
import {TransactionObserver} from './TransactionObserver';
import {INotifySdk} from './interfaces';
import {MockNotifySdk} from './MockNotifySdk';
import {Network} from '@unilogin/commons';

const WebSocket = typeof window !== 'undefined' && window.WebSocket ? window.WebSocket : require('ws');

export class NotifySdk implements INotifySdk {
  static createForNetwork(dappId: string, network: Network): INotifySdk {
    if (network === 'ganache') {
      return new MockNotifySdk();
    } else {
      return new NotifySdk(dappId, network);
    }
  }

  private readonly api: API;

  constructor(dappId: string, network: Network) {
    this.api = blocknativeSdk({
      dappId,
      networkId: Network.toNumericId(network),
      ws: WebSocket,
    });
  }

  watchTransaction(transactionHash: string) {
    const {emitter} = this.api.transaction(this.api.clientIndex, transactionHash);
    return new TransactionObserver(emitter);
  }

  watchAccount(address: string) {
    const {emitter} = this.api.account(this.api.clientIndex, address);
    return new TransactionObserver(emitter);
  }
}

import blocknativeSdk from 'bnc-sdk';
import {API} from 'bnc-sdk/dist/types/src/interfaces';
import {TransactionObserver} from './TransactionObserver';

const WebSocket = typeof window !== 'undefined' && window.WebSocket ? window.WebSocket : require('ws');

export class NotifySdk {
  private readonly api: API;

  constructor(dappId: string, networkId: number) {
    this.api = blocknativeSdk({
      dappId,
      networkId,
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

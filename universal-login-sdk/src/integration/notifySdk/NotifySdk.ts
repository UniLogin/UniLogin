import blocknativeSdk from 'bnc-sdk';
import {API, Emitter, TransactionData} from 'bnc-sdk/dist/types/src/interfaces';

const WebSocket = typeof window !== 'undefined' && window.WebSocket ? window.WebSocket : require('ws')

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

export class TransactionObserver {
  constructor(
    private readonly emitter: Emitter,
  ) {
    emitter.on('all', console.log as any);
  }

  onSent(callback: (event: TransactionData) => void) {
    this.emitter.on('txSent', callback as any)
  }

  onPool(callback: (event: TransactionData) => void) {
    this.emitter.on('txPool', callback as any)
  }

  onConfirmed(callback: (event: TransactionData) => void) {
    this.emitter.on('txConfirmed', callback as any)
  }
}

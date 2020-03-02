import {Emitter, TransactionData} from 'bnc-sdk/dist/types/src/interfaces';

export class TransactionObserver {
  constructor(
    private readonly emitter: Emitter,
  ) { }

  onSent(callback: (event: TransactionData) => void) {
    this.emitter.on('txSent', callback as any);
  }

  onPool(callback: (event: TransactionData) => void) {
    this.emitter.on('txPool', callback as any);
  }

  onConfirmed(callback: (event: TransactionData) => void) {
    this.emitter.on('txConfirmed', callback as any);
  }
}

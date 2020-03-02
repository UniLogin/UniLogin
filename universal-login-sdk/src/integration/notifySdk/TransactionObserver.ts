import {Emitter, TransactionData} from 'bnc-sdk/dist/types/src/interfaces';
import {ITransactionObserver} from './interfaces';

export class TransactionObserver implements ITransactionObserver {
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

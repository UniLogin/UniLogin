import {TransactionData} from 'bnc-sdk/dist/types/src/interfaces';

export interface INotifySdk {
  watchTransaction(transactionHash: string): ITransactionObserver;

  watchAccount(address: string): ITransactionObserver;
}

export interface ITransactionObserver {
  onSent(callback: (event: TransactionData) => void): void;

  onPool(callback: (event: TransactionData) => void): void;

  onConfirmed(callback: (event: TransactionData) => void): void;
}

import {INotifySdk, ITransactionObserver} from './interfaces';

const mockTxObserver: ITransactionObserver = {
  onConfirmed: () => {},
  onPool: () => {},
  onSent: () => {},
};

export class MockNotifySdk implements INotifySdk {
  watchTransaction() {
    return mockTxObserver;
  }

  watchAccount() {
    return mockTxObserver;
  }
}

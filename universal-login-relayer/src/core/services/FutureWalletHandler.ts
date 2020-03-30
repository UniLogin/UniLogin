import {StoredFutureWallet} from '@unilogin/commons';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export class FutureWalletHandler {
  constructor(private futureWalletStore: FutureWalletStore) {}

  handleFutureWallet(futureWallet: StoredFutureWallet) {
    return this.futureWalletStore.add(futureWallet);
  }
}

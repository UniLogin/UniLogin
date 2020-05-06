import {StoredFutureWallet} from '@unilogin/commons';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export class FutureWalletHandler {
  constructor(private futureWalletStore: FutureWalletStore) {}

  handle(futureWallet: Omit<StoredFutureWallet, 'tokenPriceInETH'>) {
    const tokenPriceInETH = '1';
    return this.futureWalletStore.add({...futureWallet, tokenPriceInETH});
  }
}

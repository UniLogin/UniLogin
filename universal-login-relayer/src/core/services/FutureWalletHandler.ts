import {StoredFutureWalletRequest, TokenPricesService} from '@unilogin/commons';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export class FutureWalletHandler {
  constructor(private futureWalletStore: FutureWalletStore, private tokenPricesService: TokenPricesService) {}

  handle(futureWallet: StoredFutureWalletRequest) {
    const tokenPriceInETH = '1';
    return this.futureWalletStore.add({...futureWallet, tokenPriceInETH});
  }
}

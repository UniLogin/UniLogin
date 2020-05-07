import {StoredFutureWalletRequest, TokenPricesService, ETHER_NATIVE_TOKEN, TokenDetailsService} from '@unilogin/commons';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';

export class FutureWalletHandler {
  constructor(
    private futureWalletStore: FutureWalletStore,
    private tokenPricesService: TokenPricesService,
    private tokenDetailsService: TokenDetailsService,
  ) {}

  async handle(futureWallet: StoredFutureWalletRequest) {
    const tokenPriceInETH = await this.getTokenPriceInEth(futureWallet.gasToken);
    return this.futureWalletStore.add({...futureWallet, tokenPriceInETH});
  }

  private async getTokenPriceInEth(tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return '1';
    }
    const tokenDetails = await this.tokenDetailsService.getTokenDetails(tokenAddress);
    const price = await this.tokenPricesService.getTokenPriceInEth(tokenDetails);
    return price.toString();
  }
}

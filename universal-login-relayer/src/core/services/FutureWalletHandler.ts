import {StoredFutureWalletRequest, TokenPricesService, ETHER_NATIVE_TOKEN, TokenDetailsService} from '@unilogin/commons';
import {FutureWalletStore} from '../../integration/sql/services/FutureWalletStore';
import {GasTokenValidator} from './validators/GasTokenValidator';

export class FutureWalletHandler {
  constructor(
    private futureWalletStore: FutureWalletStore,
    private tokenPricesService: TokenPricesService,
    private tokenDetailsService: TokenDetailsService,
    private gasTokenValidator: GasTokenValidator,
  ) {}

  async handle(futureWallet: StoredFutureWalletRequest) {
    const tokenPriceInETH = await this.getTokenPriceInEth(futureWallet.gasToken);
    const storedFutureWallet = {...futureWallet, tokenPriceInETH};
    await this.gasTokenValidator.validate(storedFutureWallet, 0.1);
    return this.futureWalletStore.add(storedFutureWallet);
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

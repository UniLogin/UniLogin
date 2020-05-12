import {StoredFutureWalletRequest, TokenPricesService, TokenDetailsService} from '@unilogin/commons';
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
    const tokenDetails = await this.tokenDetailsService.getTokenDetails(futureWallet.gasToken);
    const tokenPriceInETH = (await this.tokenPricesService.getTokenPriceInEth(tokenDetails)).toString();
    const storedFutureWallet = {...futureWallet, tokenPriceInETH};
    await this.gasTokenValidator.validate(storedFutureWallet, 0.1);
    return this.futureWalletStore.add(storedFutureWallet);
  }
}

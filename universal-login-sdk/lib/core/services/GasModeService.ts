import {utils} from 'ethers';
import {GasMode, TokensPrices, ObservedCurrency, ensureNotNull, safeMultiply} from '@universal-login/commons';
import {TokensDetailsStore} from './TokensDetailsStore';
import {GasPriceOracle} from '../../integration/ethereum/gasPriceOracle';
import {PriceObserver} from '../observers/PriceObserver';

export class GasModeService {
  constructor(
    private tokensStore: TokensDetailsStore,
    private gasPriceOracle: GasPriceOracle,
    private priceObserver: PriceObserver,
  ) {}

  private getTokenPriceInversed(tokenPrices: TokensPrices, symbol: string) {
    const multiplier = tokenPrices.ETH[symbol as any as ObservedCurrency];
    ensureNotNull(multiplier, Error, 'Invalid fee token');
    return multiplier;
  }

  private createMode(name: string, gasPrice: utils.BigNumber, tokensPrices: TokensPrices): GasMode {
    const usdAmount = this.getNormalizedCurrencyAmount(gasPrice, 'USD', tokensPrices);
    return {
      name,
      usdAmount,
      gasOptions: this.tokensStore.tokensDetails.map((tokenDetails) => {
        return ({
          token: tokenDetails,
          gasPrice: this.getNormalizedCurrencyAmount(gasPrice, tokenDetails.symbol, tokensPrices),
        });
      })
    };
  }

  private getNormalizedCurrencyAmount(gasPrice: utils.BigNumber, symbol: string, tokensPrices: TokensPrices) {
    const multiplier = this.getTokenPriceInversed(tokensPrices, symbol);
    const amount = safeMultiply(gasPrice, multiplier);
    return utils.parseUnits(amount, 18);
  }

  async getModes(): Promise<GasMode[]> {
    const gasPrices = await this.gasPriceOracle.getGasPrices();
    const tokensPrices = await this.priceObserver.getCurrentPrices();

    return [
      this.createMode('cheap', gasPrices.cheap, tokensPrices),
      this.createMode('fast', gasPrices.fast, tokensPrices)
    ];
  }
}

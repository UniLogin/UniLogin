import {utils} from 'ethers';
import {GasMode, TokensPrices, ObservedCurrency, ensureNotFalsy, safeMultiply} from '@unilogin/commons';
import {TokensDetailsStore} from './TokensDetailsStore';
import {GasPriceOracle} from '../../integration/ethereum/gasPriceOracle';
import {PriceObserver} from '../observers/PriceObserver';
import {GasPriceEstimation} from '../models/GasPriceSuggestion';

export class GasModeService {
  constructor(
    private tokensStore: TokensDetailsStore,
    private gasPriceOracle: GasPriceOracle,
    private priceObserver: PriceObserver,
  ) {}

  private getTokenPriceInversed(tokenPrices: TokensPrices, symbol: string) {
    const multiplier = tokenPrices.ETH[symbol as any as ObservedCurrency];
    ensureNotFalsy(multiplier, Error, 'Invalid fee token');
    return multiplier;
  }

  private createMode(name: string, {gasPrice, timeEstimation}: GasPriceEstimation, tokensPrices: TokensPrices): GasMode {
    const usdAmount = this.getCurrencyAmount(gasPrice, 'USD', tokensPrices);
    return {
      name,
      usdAmount,
      timeEstimation,
      gasOptions: this.tokensStore.tokensDetails.map((tokenDetails) => {
        return ({
          token: tokenDetails,
          gasPrice: utils.parseEther(this.getCurrencyAmount(gasPrice, tokenDetails.symbol, tokensPrices)),
        });
      }),
    };
  }

  getCurrencyAmount(gasPrice: utils.BigNumber, symbol: string, tokensPrices: TokensPrices) {
    const multiplier = this.getTokenPriceInversed(tokensPrices, symbol);
    return safeMultiply(gasPrice, multiplier);
  }

  async getModesWithPrices() {
    const gasPrices = await this.gasPriceOracle.getGasPrices();
    const prices = await this.priceObserver.getCurrentPrices();
    return {
      modes: [
        this.createMode('cheap', gasPrices.cheap, prices),
        this.createMode('fast', gasPrices.fast, prices),
      ],
      prices,
    };
  }

  async getModes(): Promise<GasMode[]> {
    return (await this.getModesWithPrices()).modes;
  };
}

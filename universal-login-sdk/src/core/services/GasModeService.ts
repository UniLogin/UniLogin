import {utils} from 'ethers';
import {GasMode, TokensPrices, safeMultiplyAndFormatEther, safeDivide, GasPriceOracle, GasPriceEstimation} from '@unilogin/commons';
import {TokensDetailsStore} from './TokensDetailsStore';
import {PriceObserver} from '../observers/PriceObserver';

const GAS_TOKENS = ['ETH', 'DAI'];

export class GasModeService {
  constructor(
    private tokensStore: TokensDetailsStore,
    private gasPriceOracle: GasPriceOracle,
    private priceObserver: PriceObserver,
  ) {}

  private createMode(name: string, {gasPrice, timeEstimation}: GasPriceEstimation, tokensPrices: TokensPrices): GasMode {
    const usdAmount = this.getGasPriceInUSD(gasPrice, tokensPrices);
    return {
      name,
      usdAmount,
      timeEstimation,
      gasOptions: this.tokensStore.tokensDetails.filter(tokenDetails => GAS_TOKENS.includes(tokenDetails.symbol)).map((tokenDetails) => {
        return ({
          token: tokenDetails,
          gasPrice: this.getGasPriceInToken(tokenDetails.symbol, tokensPrices, gasPrice),
        });
      }),
    };
  }

  getGasPriceInUSD(gasPrice: utils.BigNumber, tokenPrices: TokensPrices) {
    return safeMultiplyAndFormatEther(gasPrice, tokenPrices.ETH.USD);
  }

  getGasPriceInToken(tokenSymbol: string, tokenPrices: TokensPrices, gasPriceInETH: utils.BigNumber) {
    return safeDivide(gasPriceInETH, tokenPrices[tokenSymbol].ETH);
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

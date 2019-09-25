import {utils} from 'ethers';
import {GasMode, TokensPrices} from '@universal-login/commons';
import {GasPriceOracle} from '../../integration/ethereum/gasPriceOracle';
import {TokensDetailsStore} from './TokensDetailsStore';
import {PriceObserver} from '../observers/PriceObserver';

export class GasModeService {
  constructor(
    private tokensStore: TokensDetailsStore,
    private gasPriceOracle: GasPriceOracle,
    private priceObserver: PriceObserver
    ) {}

  private async getMode(name: string, gasPrice: utils.BigNumber, tokensPrices: TokensPrices): Promise<GasMode> {
    return {name, gasOptions: this.tokensStore.tokensDetails.map((tokenDetails) => ({
      token: tokenDetails,
      gasPrice,
    }))};
  }

  async getModes(): Promise<GasMode[]> {
    const gasPrices = await this.gasPriceOracle.getGasPrices();
    const tokensPrices = await this.priceObserver.getCurrentPrices();

    return [
      await this.getMode('cheap', gasPrices.cheap, tokensPrices),
      await this.getMode('fast', gasPrices.fast, tokensPrices)
    ];
  }
}

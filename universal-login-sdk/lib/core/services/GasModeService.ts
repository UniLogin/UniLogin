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

  private createMode(name: string, gasPrice: utils.BigNumber, tokensPrices: TokensPrices): GasMode {
    return {name, gasOptions: this.tokensStore.tokensDetails.map((tokenDetails) => ({
      token: tokenDetails,
      gasPrice,
    }))};
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

import {utils} from 'ethers';
import {TokenDetails, TokensPrices} from '@universal-login/commons';
import {GasPriceOracle} from '../../integration/http/gasPriceOracle';
import {TokensDetailsStore} from '../../integration/ethereum/TokensDetailsStore';
import {PriceObserver} from '../observers/PriceObserver';

export interface GasOption {
  token: TokenDetails;
  gasPrice: utils.BigNumber;
}

export interface GasMode {
  name: string;
  gasOptions: GasOption[];
}

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

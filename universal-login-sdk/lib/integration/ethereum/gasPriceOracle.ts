import {utils, providers} from 'ethers';

export type GasPriceOption = 'fast' | 'cheap';

export type GasPriceSuggestion = Record<GasPriceOption, utils.BigNumber>;

export class GasPriceOracle {
  constructor(private provider: providers.Provider) {
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const basicGasPrice = await this.provider.getGasPrice();
    return {
      cheap: basicGasPrice,
      fast: basicGasPrice.mul(6).div(5)
      };
  }
}

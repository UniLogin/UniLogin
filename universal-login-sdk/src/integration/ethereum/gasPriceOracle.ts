import {utils} from 'ethers';
import {handleApiResponse} from '@unilogin/commons';
import {fetch} from '../http/fetch';

export type GasPriceOption = 'fast' | 'cheap';

export type GasPriceEstimation = {
  gasPrice: utils.BigNumber;
  timeEstimation: string;
};

export type GasPriceSuggestion = Record<GasPriceOption, GasPriceEstimation>;

export class GasPriceOracle {
  private async estimateGasPrices() {
    const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json', {method: 'GET'});
    return handleApiResponse(response);
  }

  private convertMinutesToSec(minutes: number): string {
    return (minutes * 60).toString();
  }

  private convert10xGweiToWei(gwei10x: number): utils.BigNumber {
    return utils.parseUnits((gwei10x / 10).toString(), 'gwei');
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const gasPriceEstimations = await this.estimateGasPrices();
    const {average, avgWait, fast, fastWait} = gasPriceEstimations;
    return {
      cheap: {
        gasPrice: this.convert10xGweiToWei(average),
        timeEstimation: this.convertMinutesToSec(avgWait),
      },
      fast: {
        gasPrice: this.convert10xGweiToWei(fast),
        timeEstimation: this.convertMinutesToSec(fastWait),
      },
    };
  }
}

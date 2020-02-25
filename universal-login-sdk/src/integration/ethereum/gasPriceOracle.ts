import {utils} from 'ethers';
import {handleApiResponse} from '@unilogin/commons';
import {fetch} from '../http/fetch';
import {GasPriceSuggestion} from '../../core/models/GasPriceSuggestion';

export class GasPriceOracle {
  private async estimateGasPrices() {
    const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json', {method: 'GET'});
    return handleApiResponse(response);
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const gasPriceEstimations = await this.estimateGasPrices();
    const {average, avgWait, fast, fastWait} = gasPriceEstimations;
    return {
      cheap: {
        gasPrice: convert10xGweiToWei(average),
        timeEstimation: convertMinutesToSec(avgWait),
      },
      fast: {
        gasPrice: convert10xGweiToWei(fast),
        timeEstimation: convertMinutesToSec(fastWait),
      },
    };
  }
}

const convertMinutesToSec = (minutes: number): number => minutes * 60;

const convert10xGweiToWei = (gwei10x: number): utils.BigNumber => utils.parseUnits((gwei10x / 10).toString(), 'gwei');

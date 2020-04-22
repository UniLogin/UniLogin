import {utils} from 'ethers';
import {asObject, asNumber, cast} from '@restless/sanitizers';
import {GasPriceSuggestion} from '../../core/models/GasPriceSuggestion';
import {handleApiResponse} from '../http/http';
import {fetch} from '../http/fetch';

export class GasPriceOracle {
  private async fetchGasPrices() {
    const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json', {method: 'GET'});
    return cast(await handleApiResponse(response), asApiResponse);
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const {average, avgWait, fast, fastWait} = await this.fetchGasPrices();
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

const asApiResponse = asObject({
  average: asNumber,
  avgWait: asNumber,
  fast: asNumber,
  fastWait: asNumber,
});

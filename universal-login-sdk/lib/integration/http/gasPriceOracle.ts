import {http, HttpFunction, convertTenthGweiToWei} from '@universal-login/commons';
import {utils} from 'ethers';
import {fetch} from './fetch';

export type GasPriceOption = 'fastest' | 'fast' | 'average';

export type GasPriceSuggestion = Record<GasPriceOption, utils.BigNumber>;

export class GasPriceOracle {
  private http: HttpFunction;
  private GAS_PRICE_ORACLE_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

  constructor() {
    this.http = http(fetch)(this.GAS_PRICE_ORACLE_URL);
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const response = await this.http('GET', '');
    return {
      fastest: convertTenthGweiToWei(response.fastest),
      fast: convertTenthGweiToWei(response.fast),
      average: convertTenthGweiToWei(response.average),
    };
  }
}

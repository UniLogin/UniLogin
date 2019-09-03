import {http} from '@universal-login/commons';
import {fetch} from './fetch';
import {HttpFunction} from '@universal-login/commons/lib';

export type GasPriceOption = 'fastest' | 'fast' | 'average';

export type GasPriceSuggestion = Record<GasPriceOption, number>;

export class GasPriceOracle {
  private http: HttpFunction;
  private GAS_PRICE_ORACLE_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

  constructor() {
    this.http = http(fetch)(this.GAS_PRICE_ORACLE_URL);
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const {fastest, fast, average} = await this.http('GET', '');
    return {fastest, fast, average};
  }
}

import {http, HttpFunction, convertTenthGweiToWei} from '@universal-login/commons';
import {utils} from 'ethers';
import {fetch} from './fetch';

export type GasPriceOption = 'fast' | 'cheap';

export type GasPriceDetails = {
  price: utils.BigNumber;
  waitTime: string;
};

export type GasPriceSuggestion = Record<GasPriceOption, GasPriceDetails>;

export class GasPriceOracle {
  private http: HttpFunction;
  private GAS_PRICE_ORACLE_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

  constructor() {
    this.http = http(fetch)(this.GAS_PRICE_ORACLE_URL);
  }

  async getGasPrices(): Promise<GasPriceSuggestion> {
    const response = await this.http('GET', '');
    return {
      fast: {
        waitTime: response.fastWait,
        price: convertTenthGweiToWei(response.fast)
      },
      cheap: {
        waitTime: response.avgWait,
        price: convertTenthGweiToWei(response.average)
      }
    };
  }
}

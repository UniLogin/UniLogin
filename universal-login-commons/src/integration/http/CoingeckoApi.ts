import {cast, Sanitizer, asNumber, asObject} from '@restless/sanitizers';
import {http} from './http';
import {fetch, ETHER_NATIVE_TOKEN, ObservedCurrency, TokenDetails} from '../..';

export interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

export class CoingeckoApi {
  private _http = http(fetch)('https://api.coingecko.com/api/v3');

  getCoingeckoId = (token: TokenDetails) => {
    switch (token.symbol) {
      case ETHER_NATIVE_TOKEN.symbol:
        return 'ethereum';
      case 'DAI':
        return 'dai';
      case 'SAI':
        return 'sai';
      default:
        return token.name.split(' ').join('-').toLowerCase();
    }
  };

  fetchTokenImageUrl = async (token: TokenDetails) => {
    const coingeckoId = this.getCoingeckoId(token);
    const response = await this._http('GET', `/coins/${coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`);
    return response.image.small;
  };

  fetchTokenInfo = async (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
    const tokens = tokenDetails.map(token => token.coingeckoId);
    const query = `ids=${tokens.join(',')}&vs_currencies=${currencies.join(',')}`;
    const result = await this._http('GET', `/simple/price?${query}`);
    const asTokenPrices = this.asRecord(tokens, this.asRecord(currencies.map(currency => currency.toLowerCase()), asNumber));
    return cast(result, asTokenPrices);
  };

  private asRecord<K extends keyof any, V>(keys: K[], valueSanitizer: Sanitizer<V>): Sanitizer<Record<K, V>> {
    const schema: Record<K, Sanitizer<V>> = {} as any;
    for (const key of keys) {
      schema[key] = valueSanitizer;
    }
    return asObject(schema);
  }
};

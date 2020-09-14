import {asArray, asNumber, asObject, asString, cast, Sanitizer} from '@restless/sanitizers';
import {fetch, http} from '../..';
import {CoingeckoToken} from './Coingecko';

export interface CoingeckoApiInterface {
  getTokensList: () => Promise<CoingeckoToken[]>;
  getTokenImageUrl: (coingeckoId: string) => Promise<string>;
  getTokenInfo: (tokens: string[], currencies: string[]) => Promise<Record<string, Record<string, number>>>;
};

export class CoingeckoApi implements CoingeckoApiInterface {
  private _http = http(fetch)('https://api.coingecko.com/api/v3');

  getTokensList = async () => {
    const result = await this._http('GET', '/coins/list');
    return cast(result, asCoingeckoTokens);
  };

  async getTokenImageUrl(coingeckoId: string) {
    const response = await this._http('GET', `/coins/${coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`);
    return response.image.small;
  }

  async getTokenInfo(tokens: string[], currencies: string[]) {
    const query = `ids=${tokens.join(',')}&vs_currencies=${currencies.join(',')}`;
    const result = await this._http('GET', `/simple/price?${query}`);
    const asTokenPrices = this.asRecord(tokens, this.asRecord(currencies.map(currency => currency.toLowerCase()), asNumber));
    return cast(result, asTokenPrices);
  }

  private asRecord<K extends keyof any, V>(keys: K[], valueSanitizer: Sanitizer<V>): Sanitizer<Record<K, V>> {
    const schema: Record<K, Sanitizer<V>> = {} as any;
    for (const key of keys) {
      schema[key] = valueSanitizer;
    }
    return asObject(schema);
  }
};

const asCoingeckoToken = asObject<CoingeckoToken>({
  name: asString,
  symbol: asString,
  id: asString,
});

const asCoingeckoTokens = asArray(asCoingeckoToken);

import {cast, Sanitizer, asNumber, asObject, asString, asArray} from '@restless/sanitizers';
import {http} from './http';
import {fetch, ObservedCurrency, TokenDetails} from '../..';

export interface CoingeckoToken {
  id: string;
  symbol: string;
  name: string;
};

export interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

export class CoingeckoApi {
  private _http = http(fetch)('https://api.coingecko.com/api/v3');
  private static tokensList: Promise<CoingeckoToken[]>;

  getTokensList = async () => {
    const result = await this._http('GET', '/coins/list');
    return cast(result, asCoingeckoTokens);
  };

  lazyGetTokensList = (): Promise<CoingeckoToken[]> => {
    CoingeckoApi.tokensList = CoingeckoApi.tokensList || this.getTokensList();
    return CoingeckoApi.tokensList;
  };

  findIdBySymbol(tokensList: CoingeckoToken[], token: TokenDetails) {
    const symbol = token.symbol.toLowerCase();
    const matchedTokens = tokensList.filter(token => token.symbol === symbol);
    return matchedTokens.length === 1 ? matchedTokens[0].id : this.generateIdFromName(token.name);
  }

  private generateIdFromName = (name: string) => name.split(' ').join('-').toLowerCase();

  getCoingeckoId = async (token: TokenDetails) => {
    return this.findIdBySymbol(await this.lazyGetTokensList(), token);
  };

  fetchTokenImageUrl = async (token: TokenDetails) => {
    const coingeckoId = await this.getCoingeckoId(token);
    const response = await this._http('GET', `/coins/${coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`);
    return response.image.small;
  };

  fetchTokenInfo = async (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
    const tokens = tokenDetails
      .filter((token, index, tokens) => tokens.findIndex(t => t.symbol === token.symbol) === index)
      .map(token => token.coingeckoId);
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

const asCoingeckoToken = asObject<CoingeckoToken>({
  name: asString,
  symbol: asString,
  id: asString,
});

const asCoingeckoTokens = asArray(asCoingeckoToken);

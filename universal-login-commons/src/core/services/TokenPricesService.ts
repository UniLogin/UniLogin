import {ObservedCurrency, TokensPrices, http as _http, TokenDetails, ETHER_NATIVE_TOKEN, fetch} from '../../';
const cryptocompare = require('cryptocompare');
import {Sanitizer, asObject, asNumber, cast} from '@restless/sanitizers';

interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

export class TokenPricesService {
  async getPrices(tokensDetails: TokenDetails[]): Promise<TokensPrices> {
    const tokenDetailsWithCoingeckoId = tokensDetails.map(token => ({...token, coingeckoId: this.getCoingeckoId(token)}));
    const pricesWithCoingeckoId = await this.fetchTokenInfo(tokenDetailsWithCoingeckoId, ['ETH', 'USD']);
    return this.getPricesFromPricesWithCoingeckoId(tokenDetailsWithCoingeckoId, pricesWithCoingeckoId);
  }

  getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
    const priceInCurrency = await cryptocompare.price('ETH', currency);
    return priceInCurrency[currency];
  };

  private fetchTokenInfo = async (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
    const http = _http(fetch)('https://api.coingecko.com/api/v3');
    const tokens = tokenDetails.map(token => token.coingeckoId);
    const query = `ids=${tokens.join(',')}&vs_currencies=${currencies.join(',')}`;
    const result = await http('GET', `/simple/price?${query}`);
    const asTokenPrices = this.asRecord(tokens, this.asRecord(currencies.map(currency => currency.toLowerCase()), asNumber));
    return cast(result, asTokenPrices);
  };

  private getCoingeckoId = (token: TokenDetails) => {
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

  private getPricesFromPricesWithCoingeckoId = (tokenDetailsWithCoingeckoId: TokenDetailsWithCoingeckoId[], pricesWithCoingeckoId: TokensPrices) => {
    const prices: TokensPrices = {};
    for (const token of tokenDetailsWithCoingeckoId) {
      prices[token.symbol] = this.getPricesForToken(token, pricesWithCoingeckoId);
    }
    return prices;
  };

  private getPricesForToken = (token: TokenDetailsWithCoingeckoId, pricesWithCoingeckoId: TokensPrices) => {
    const pricesForToken = {} as Record<ObservedCurrency, number>;
    Object.keys(pricesWithCoingeckoId[token.coingeckoId]).map(key => {
      pricesForToken[key.toUpperCase() as ObservedCurrency] = (pricesWithCoingeckoId as any)[token.coingeckoId][key];
    });
    return pricesForToken;
  };

  private asRecord<K extends keyof any, V>(keys: K[], valueSanitizer: Sanitizer<V>): Sanitizer<Record<K, V>> {
    const schema: Record<K, Sanitizer<V>> = {} as any;
    for (const key of keys) {
      schema[key] = valueSanitizer;
    }
    return asObject(schema);
  }
};

import {ObservedCurrency, TokensPrices, http as _http, TokenDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
const cryptocompare = require('cryptocompare');
import {fetch} from './fetch';
import {Sanitizer, asObject, asNumber, cast} from '@restless/sanitizers';

interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

const fetchTokenInfo = async (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
  const http = _http(fetch)('https://api.coingecko.com/api/v3');
  const tokens = tokenDetails.map(token => token.coingeckoId);
  const query = `ids=${tokens.join(',')}&vs_currencies=${currencies.join(',')}`;
  const result = await http('GET', `/simple/price?${query}`);
  const asTokenPrices = asRecord(tokens, asRecord(currencies.map(currency => currency.toLowerCase()), asNumber));
  return cast(result, asTokenPrices);
};

const getCoingeckoId = (token: TokenDetails) => {
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

export async function getPrices(fromTokens: TokenDetails[], toTokens: ObservedCurrency[]): Promise<TokensPrices> {
  const tokenDetailsWithCoingeckoId = fromTokens.map(token => ({...token, coingeckoId: getCoingeckoId(token)}));
  const pricesWithCoingeckoId = await fetchTokenInfo(tokenDetailsWithCoingeckoId, ['ETH', 'USD']);
  return getPricesFromPricesWithCoingeckoId(tokenDetailsWithCoingeckoId, pricesWithCoingeckoId);
}

const getPricesFromPricesWithCoingeckoId = (tokenDetailsWithCoingeckoId: TokenDetailsWithCoingeckoId[], pricesWithCoingeckoId: TokensPrices) => {
  const prices: TokensPrices = {};
  for (const token of tokenDetailsWithCoingeckoId) {
    prices[token.symbol] = getPricesForToken(token, pricesWithCoingeckoId);
  }
  return prices;
};

const getPricesForToken = (token: TokenDetailsWithCoingeckoId, pricesWithCoingeckoId: TokensPrices) => {
  const pricesForToken = {} as Record<ObservedCurrency, number>;
  Object.keys(pricesWithCoingeckoId[token.coingeckoId]).map(key => {
    pricesForToken[key.toUpperCase() as ObservedCurrency] = (pricesWithCoingeckoId as any)[token.coingeckoId][key];
  });
  return pricesForToken;
};

function asRecord<K extends keyof any, V>(keys: K[], valueSanitizer: Sanitizer<V>): Sanitizer<Record<K, V>> {
  const schema: Record<K, Sanitizer<V>> = {} as any;
  for (const key of keys) {
    schema[key] = valueSanitizer;
  }
  return asObject(schema);
}

export const getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
  const priceInCurrency = await cryptocompare.price('ETH', currency);
  return priceInCurrency[currency];
};

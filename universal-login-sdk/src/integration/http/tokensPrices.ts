import {ObservedCurrency, TokensPrices, http as _http, TokenDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
const cryptocompare = require('cryptocompare');
import {fetch} from './fetch';

interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

const fetchTokenInfo = (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
  const http = _http(fetch)('https://api.coingecko.com/api/v3');
  // `simple/price?ids=${tokenDetails.coingeckoId}%2Cdai&vs_currencies=usd%2Ceth%2Ceur`
  const query = `ids=${tokenDetails.map(token => token.coingeckoId).join(',')}&vs_currencies=${currencies.join(',')}`;
  console.log(query);
  const dupa = `/simple/price?${query}`

  // https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cjarvis-reward-token&vs_currencies=usd
  console.log(dupa);
  return http('GET', dupa);
};

const getCoingeckoId = (tokenName: string) => {
  if (tokenName === ETHER_NATIVE_TOKEN.name) {
    return 'ethereum';
  } else if (tokenName === 'Dai Stablecoin') {
    return 'dai';
  }
  return tokenName.split(' ').join('-').toLowerCase();
};

export async function getPrices(fromTokens: TokenDetails[], toTokens: ObservedCurrency[]): Promise<TokensPrices> {
  // const prices = {} as TokensPrices;
  console.log(toTokens);
  const tokenDetailsWithCoingeckoId = fromTokens.map(token => ({...token, coingeckoId: getCoingeckoId(token.name)}));
  const pricesWithCoingeckoId = await fetchTokenInfo(tokenDetailsWithCoingeckoId, ['ETH', 'USD']);
  console.log(pricesWithCoingeckoId)
  let prices: TokensPrices = {};
  tokenDetailsWithCoingeckoId.map(token => {
    prices[token.symbol] = {} as Record<ObservedCurrency, number>;
    const keys = Object.keys(pricesWithCoingeckoId[token.coingeckoId]);
    keys.map(key => {
      prices[token.symbol] = {...prices[token.symbol], [key.toUpperCase()]: pricesWithCoingeckoId[token.coingeckoId][key]}
    })
  })
  console.log(prices)
  Object.keys(prices).map(key=> key.toUpperCase());
  return prices;
}

export const getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
  const priceInCurrency = await cryptocompare.price('ETH', currency);
  return priceInCurrency[currency];
};

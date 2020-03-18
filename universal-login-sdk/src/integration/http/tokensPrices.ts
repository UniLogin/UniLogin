import {ObservedCurrency, TokensPrices, http as _http, TokenDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
const cryptocompare = require('cryptocompare');
import {fetch} from './fetch';

interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

const fetchTokenInfo = (tokenDetails: TokenDetailsWithCoingeckoId) => {
  const http = _http(fetch)('https://api.coingecko.com/api/v3');
  return http('GET', `/coins/${tokenDetails.coingeckoId}`);
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
  const prices = {} as TokensPrices;
  const tokenDetailsWithCoingeckoId = fromTokens.map(token => ({...token, coingeckoId: getCoingeckoId(token.name)}));
  for (let i = 0; i < fromTokens.length; i++) {
    const tokenInfo = await fetchTokenInfo(tokenDetailsWithCoingeckoId[i]);
    prices[tokenDetailsWithCoingeckoId[i].symbol] = {} as any;
    toTokens.map(token => {
      prices[tokenDetailsWithCoingeckoId[i].symbol][token] = tokenInfo.market_data.current_price[token.toLowerCase()];
    });
  };
  return prices;
}

export const getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
  const priceInCurrency = await cryptocompare.price('ETH', currency);
  return priceInCurrency[currency];
};

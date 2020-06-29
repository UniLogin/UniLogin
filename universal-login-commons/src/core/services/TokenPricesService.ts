import {ObservedCurrency, TokensPrices, TokenDetails, ETHER_NATIVE_TOKEN} from '../../';
import {CoingeckoApi, TokenDetailsWithCoingeckoId} from '../../integration/http/CoingeckoApi';
const cryptocompare = require('cryptocompare');

export class TokenPricesService {
  constructor(private coingeckoApi = new CoingeckoApi()) {};

  async getPrices(tokensDetails: TokenDetails[]): Promise<TokensPrices> {
    const coingeckoTokensList = await this.coingeckoApi.lazyGetTokensList();
    const tokenDetailsWithCoingeckoId = tokensDetails
      .map(this.updateAaveTokenDetails)
      .map(token => ({...token, coingeckoId: this.coingeckoApi.findIdBySymbol(coingeckoTokensList, token)}));
    const pricesWithCoingeckoId = await this.coingeckoApi.fetchTokenInfo(tokenDetailsWithCoingeckoId, ['ETH', 'USD']);
    const originalTokenDetailsWithCoingeckoId = tokenDetailsWithCoingeckoId.map(this.getOriginalAaveToken);
    return this.getPricesFromPricesWithCoingeckoId(originalTokenDetailsWithCoingeckoId, pricesWithCoingeckoId);
  }

  updateAaveTokenDetails(token: TokenDetails) {
    if (['aUSDC', 'aUSDT', 'aBUSD', 'aSUSD'].includes(token.symbol)) {
      return {...token, symbol: token.symbol.slice(1)};
    }
    return token;
  }

  getOriginalAaveToken(token: TokenDetailsWithCoingeckoId) {
    if (token.name.toLowerCase().includes('aave') && token.symbol !== 'aTUSD') {
      return {...token, symbol: `a${token.symbol}`};
    } else {
      return token;
    }
  }

  async getTokenPriceInEth(tokenDetails: TokenDetails): Promise<number> {
    if (tokenDetails.address === ETHER_NATIVE_TOKEN.address) {
      return 1;
    }
    const prices = await this.getPrices([tokenDetails]);
    return prices[tokenDetails.symbol].ETH;
  }

  getEtherPriceInCurrency = async (currency: 'USD' | 'EUR' | 'GBP'): Promise<string> => {
    const priceInCurrency = await cryptocompare.price('ETH', currency);
    return priceInCurrency[currency];
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
};

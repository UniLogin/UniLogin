import {ObservedCurrency, TokensPrices, TokenDetails, ETHER_NATIVE_TOKEN} from '../../';
import {Coingecko, TokenDetailsWithCoingeckoId} from '../../integration/http/Coingecko';
import {CoingeckoToken} from '../models/CoingeckoToken';
const cryptocompare = require('cryptocompare');

const aaveTokens = [
  '0x9bA00D6856a4eDF4665BcA2C2309936572473B7E',
  '0x71fc860F7D3A592A4a98740e39dB31d25db65ae8',
  '0x6Ee0f7BB50a54AB5253dA0667B0Dc2ee526C30a8',
  '0x625aE63000f46200499120B906716420bd059240',
];

export class TokenPricesService {
  constructor(private coingecko = new Coingecko()) {};

  async getPrices(tokensDetails: TokenDetails[]): Promise<TokensPrices> {
    const coingeckoTokensList = await this.coingecko.lazyGetTokensList();
    const tokenDetailsWithCoingeckoId = tokensDetails
      .map(this.updateAaveTokenDetails)
      .map(token => this.addCoingeckoId(token, coingeckoTokensList))
      .map(this.getOriginalAaveToken);
    const pricesWithCoingeckoId = await this.coingecko.fetchTokenInfo(tokenDetailsWithCoingeckoId, ['ETH', 'USD']);
    return this.getPricesFromPricesWithCoingeckoId(tokenDetailsWithCoingeckoId, pricesWithCoingeckoId);
  }

  addCoingeckoId(token: TokenDetails, tokens: CoingeckoToken[]) {
    return ({
      ...token,
      coingeckoId: this.coingecko.findIdBySymbol(tokens, token),
    });
  }

  updateAaveTokenDetails(token: TokenDetails) {
    if (aaveTokens.includes(token.address)) {
      return {
        ...token,
        symbol: token.symbol.slice(1),
        name: token.name.replace('Aave Interest bearing ', ''),
      };
    }
    return token;
  }

  getOriginalAaveToken(token: TokenDetailsWithCoingeckoId) {
    if (aaveTokens.includes(token.address)) {
      return {
        ...token,
        symbol: `a${token.symbol}`,
        name: `Aave Interest Bearing ${token.name}`,
      };
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

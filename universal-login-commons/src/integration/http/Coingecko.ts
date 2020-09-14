import {ObservedCurrency, TokenDetails} from '../..';
import {CoingeckoToken} from '../../core/models/CoingeckoToken';
import {CoingeckoApi, CoingeckoApiInterface} from './CoingeckoApi';

export interface TokenDetailsWithCoingeckoId extends TokenDetails {
  coingeckoId: string;
};

export class Coingecko {
  private static tokensList: Promise<CoingeckoToken[]>;

  constructor(private coingeckoApi: CoingeckoApiInterface = new CoingeckoApi()) {}

  lazyGetTokensList = (): Promise<CoingeckoToken[]> => {
    Coingecko.tokensList = Coingecko.tokensList || this.coingeckoApi.getTokensList();
    return Coingecko.tokensList;
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
    return this.coingeckoApi.getTokenImageUrl(coingeckoId);
  };

  fetchTokenInfo = async (tokenDetails: TokenDetailsWithCoingeckoId[], currencies: ObservedCurrency[]) => {
    const tokens = this.removeDuplications(tokenDetails).map(token => token.coingeckoId);
    return this.coingeckoApi.getTokenInfo(tokens, currencies);
  };

  private removeDuplications = (tokens: TokenDetailsWithCoingeckoId[]) => tokens.filter((token, index, tokens) => tokens.findIndex(t => t.symbol === token.symbol) === index);
};

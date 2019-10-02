import {TokenDetails, TokenDetailsService} from '@universal-login/commons';

export class TokensDetailsStore {
  tokensDetails: TokenDetails[] = [];

  constructor(private tokenDetailsService: TokenDetailsService, private tokensAddresses: string[]) {}

  async fetchTokensDetails() {
    if (this.tokensDetails.length === 0) {
      this.tokensDetails = await this.tokenDetailsService.getTokensDetails(this.tokensAddresses);
    }
  }

  getTokenAddress(symbol: string) {
    const token = this.tokensDetails.find((token) => token.symbol === symbol);
    return token ? token.address : undefined;
  }
}

import {providers, Contract} from 'ethers';
const Token = require('openzeppelin-solidity/build/contracts/ERC20Detailed.json');

declare type TokenDetails = {
  name: string;
  symbol: string;
  address: string;
};

class TokenService {
  tokensDetails: TokenDetails[];

  constructor(private tokensAddresses: string[], private provider: providers.Provider) {
    this.tokensDetails = [];
  }

  async start() {
    for (let count = 0; count < this.tokensAddresses.length; count++) {
      const token = new Contract(this.tokensAddresses[count], Token.abi, this.provider);
      const symbol = await token.symbol();
      const name = await token.name();
      this.tokensDetails[count] = {name, symbol, address: token.address};
    }
  }

  getTokenAddress(symbol: string) {
    for (let count = 0; count < this.tokensDetails.length; count++) {
      if (this.tokensDetails[count].symbol === symbol) 
        return this.tokensDetails[count].address;
    }
  }
}

export default TokenService;

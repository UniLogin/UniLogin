import {providers, Contract} from 'ethers';
const Token = require('openzeppelin-solidity/build/contracts/ERC20Detailed.json');
import {ETHER} from 'universal-login-commons';

declare type TokenDetails = {
  name: string;
  symbol: string;
  address: string;
};

class TokenService {
  tokensDetails: TokenDetails[];

  constructor(private tokensAddresses: string[], private provider: providers.Provider) {
    this.tokensDetails = [{name: '', symbol: '', address: ''}];
  }

  async start() {
    for (let count = 0; count < this.tokensAddresses.length; count++) {
      if (this.tokensAddresses[count] === ETHER.address){
        this.tokensDetails[count] = ETHER;
      } else {
        const token = new Contract(this.tokensAddresses[count], Token.abi, this.provider);
        const symbol = await token.symbol();
        const name = await token.name();
        this.tokensDetails[count] = {name, symbol, address: token.address};
      }
    }
  }

  getTokenAddress(symbol: string) {
    const token = this.tokensDetails.find(token => token.symbol === symbol);
    return token ? token.address : undefined;
  }
}

export default TokenService;

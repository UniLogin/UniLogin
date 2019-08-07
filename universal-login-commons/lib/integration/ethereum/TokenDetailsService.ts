import {providers, Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import {TokenDetails} from '../../core/models/TokenData';

const tokenAbi = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)'
];

export class TokenDetailsService {
  constructor(private provider: providers.Provider) {}

  async getTokenDetails(tokenAddress: string): Promise<TokenDetails> {
    const symbol = await this.getSymbol(tokenAddress);
    const name = await this.getName(tokenAddress);
    return {address: tokenAddress, symbol, name};
  }

  async getSymbol(tokenAddress: string): Promise<string> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return 'ETH';
    }
    const token = new Contract(tokenAddress, tokenAbi, this.provider);
    return token.symbol();
  }

  async getName(tokenAddress: string): Promise<string> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return 'ether';
    }
    const token = new Contract(tokenAddress, tokenAbi, this.provider);
    return token.name();
  }
}

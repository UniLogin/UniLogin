import {providers, Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';

const tokenAbi = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)'
];

export class TokenDetailsService {
  constructor(private provider: providers.Provider) {}

  async getSymbol(tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return 'ETH';
    }
    const token = new Contract(tokenAddress, tokenAbi, this.provider);
    return token.symbol();
  }

  async getName(tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return 'ether';
    }
    const token = new Contract(tokenAddress, tokenAbi, this.provider);
    return token.name();
  }
}

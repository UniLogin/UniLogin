import {providers, Contract, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import {TokenDetails} from '../../core/models/TokenData';

const tokenAbiString = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)'
];

const tokenAbiBytes32 = [
  'function name() public view returns (bytes32)',
  'function symbol() public view returns (bytes32)'
];

export class TokenDetailsService {
  constructor(private provider: providers.Provider) {}

  async getTokensDetails(tokenAddresses: string[]) {
    const tokensDetails: TokenDetails[] = [];
    for (const address of tokenAddresses) {
      const tokenDetails = await this.getTokenDetails(address);
      tokensDetails.push(tokenDetails);
    }
    return tokensDetails;
  }

  async getTokenDetails(tokenAddress: string): Promise<TokenDetails> {
    const symbol = await this.getSymbol(tokenAddress);
    const name = await this.getName(tokenAddress);
    return {address: tokenAddress, symbol, name};
  }

  async getSymbol(tokenAddress: string): Promise<string> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return ETHER_NATIVE_TOKEN.symbol;
    }
    try {
      const token = new Contract(tokenAddress, tokenAbiString, this.provider);
      return await token.symbol();
    } catch (error) {
      const token = new Contract(tokenAddress, tokenAbiBytes32, this.provider);
      return utils.parseBytes32String(await token.symbol());
    }
  }

  async getName(tokenAddress: string): Promise<string> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return ETHER_NATIVE_TOKEN.name;
    }
    try {
      const token = new Contract(tokenAddress, tokenAbiString, this.provider);
      return await token.name();
    } catch (error) {
      const token = new Contract(tokenAddress, tokenAbiBytes32, this.provider);
      return utils.parseBytes32String(await token.name());
    }
  }
}

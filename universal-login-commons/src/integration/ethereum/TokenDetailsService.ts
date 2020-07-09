import {providers, Contract, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import {TokenDetails} from '../../core/models/TokenData';
import {addressEquals} from '../..';

const tokenAbiString = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
];

const tokenAbiBytes32 = [
  'function name() public view returns (bytes32)',
  'function symbol() public view returns (bytes32)',
];

export class TokenDetailsService {
  constructor(private provider: providers.Provider, private saiTokenAddress?: string) {}

  async getTokensDetails(tokenAddresses: string[]) {
    const tokensDetails: TokenDetails[] = [];
    for (const address of tokenAddresses) {
      const tokenDetails = await this.getTokenDetails(address);
      tokensDetails.push(tokenDetails);
    }
    return tokensDetails;
  }

  async getTokenDetails(tokenAddress: string): Promise<TokenDetails> {
    if (this.saiTokenAddress && addressEquals(tokenAddress, this.saiTokenAddress)) {
      return {address: this.saiTokenAddress, symbol: 'SAI', name: 'Sai Stablecoin v1.0', decimals: 18};
    }
    const symbol = await this.getSymbol(tokenAddress);
    const name = await this.getName(tokenAddress);
    const decimals = await this.getDecimals(tokenAddress);
    return {address: tokenAddress, symbol, name, decimals};
  }

  async getDecimals(tokenAddress: string): Promise<number> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return ETHER_NATIVE_TOKEN.decimals;
    }
    const token = new Contract(tokenAddress, tokenAbiString, this.provider);
    return token.decimals();
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

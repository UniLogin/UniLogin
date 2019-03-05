import {providers, Contract, utils} from 'ethers';
import Token from '../contracts/Token.json';


export class TokenService {
  tokenContract: Contract;

  constructor(private tokenContractAddress: string, private provider: providers.Provider) {
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.provider);
  }

  async getBalance(address: string) {
    return utils.formatEther(await this.tokenContract.balanceOf(address));
  }
}

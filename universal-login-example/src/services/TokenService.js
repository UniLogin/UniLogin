import {utils, Contract} from 'ethers';
import Token from '../../build/Token';

class TokenService {
  constructor(tokenContractAddress, provider) {
    this.tokenContractAddress = tokenContractAddress;
    this.provider = provider;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.provider);
  }

  async getBalance(address) {
    return utils.formatEther(await this.tokenContract.balanceOf(address));
  }
}

export default TokenService;

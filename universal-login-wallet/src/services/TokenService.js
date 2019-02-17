import {Wallet, Contract} from 'ethers';
import Token from './Token';

export default class TokenService {
  constructor(tokenAddress, provider) {
    this.tokenContract = new Contract(tokenAddress, Token.interface, provider);
  }

  async getBalance(address) {
    return this.tokenContract.balanceOf(address);
  }
}


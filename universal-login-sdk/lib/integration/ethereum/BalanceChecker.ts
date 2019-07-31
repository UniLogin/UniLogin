import {providers, Contract} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

export class BalanceChecker {
  constructor(private provider: providers.Provider, private walletAddress: string) {}

  getBalance(tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.getEthBalance();
    }
    return this.getTokenBalance(tokenAddress);
  }

  private getEthBalance() {
    return this.provider.getBalance(this.walletAddress);
  }

  private getTokenBalance(tokenAddress: string) {
    const token = new Contract(tokenAddress, IERC20.abi, this.provider);
    return token.balanceOf(this.walletAddress);
  }
}

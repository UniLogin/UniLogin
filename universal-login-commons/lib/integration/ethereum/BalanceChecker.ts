import {providers, Contract, utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';

export class BalanceChecker {
  constructor(private provider: providers.Provider) {}

  getBalance(walletAddress: string, tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.getEthBalance(walletAddress);
    }
    return this.getTokenBalance(walletAddress, tokenAddress);
  }

  private async getEthBalance(walletAddress: string) {
    const balance = await this.provider.getBalance(walletAddress);
    return balance.toString();
  }

  private async getTokenBalance(walletAddress: string, tokenAddress: string) {
    const token = new Contract(tokenAddress, IERC20.abi, this.provider);
    const balance: utils.BigNumber = await token.balanceOf(walletAddress);
    return balance.toString();
  }
}

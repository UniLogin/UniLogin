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

  private getEthBalance(walletAddress: string) {
    return this.provider.getBalance(walletAddress);
  }

  private getTokenBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    const token = new Contract(tokenAddress, IERC20.abi, this.provider);
    return token.balanceOf(walletAddress);
  }
}

import {providers, Contract, utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import {ensure} from '../../core/utils/errors/heplers';
import {isContract} from '../../core/utils/contracts/contractHelpers';
import {InvalidContract} from '../../core/utils/errors/errors';

export class BalanceChecker {
  constructor(private provider: providers.Provider) {}

  async getBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.getEthBalance(walletAddress);
    }
    return this.getTokenBalance(walletAddress, tokenAddress);
  }

  private async getEthBalance(walletAddress: string): Promise<utils.BigNumber> {
    return this.provider.getBalance(walletAddress);
  }

  private async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    ensure(await isContract(this.provider, tokenAddress), InvalidContract, tokenAddress);
    const token = new Contract(tokenAddress, IERC20.abi, this.provider);
    return token.balanceOf(walletAddress);
  }
}

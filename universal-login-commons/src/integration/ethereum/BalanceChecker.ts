import {utils, Contract} from 'ethers';
import {ProviderService} from './ProviderService';
import {ETHER_NATIVE_TOKEN} from '../../core/constants/constants';
import {ensure} from '../../core/utils/errors/ensure';
import {InvalidContract} from '../../core/utils/errors/errors';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';

export class BalanceChecker {
  constructor(private providerService: ProviderService) {
  }

  getBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.providerService.getEthBalance(walletAddress);
    }
    return this.getTokenBalance(walletAddress, tokenAddress);
  }

  private async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    ensure(await this.providerService.isContract(tokenAddress), InvalidContract, tokenAddress);
    const token = new Contract(tokenAddress, IERC20.abi, this.providerService.getProvider());
    return token.balanceOf(walletAddress);
  }
}

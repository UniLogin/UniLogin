import {utils} from 'ethers';
import {ProviderService} from './ProviderService';

export class BalanceChecker {
  constructor(private providerService: ProviderService) {
  }

  getBalance(walletAddress: string, tokenAddress: string): Promise<utils.BigNumber> {
    return this.providerService.getBalance(walletAddress, tokenAddress);
  }
}

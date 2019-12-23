import {utils} from 'ethers';
import {BalanceChecker} from '../../integration/ethereum/BalanceChecker';
import {SupportedToken} from '../models/relayer';

export class RequiredBalanceChecker {
  constructor(private balanceChecker: BalanceChecker) {}

  async findTokenWithRequiredBalance(supportedTokens: SupportedToken[], contractAddress: string) {
    for (const supportedToken of supportedTokens) {
      const balance = await this.balanceChecker.getBalance(contractAddress, supportedToken.address);
      if (supportedToken.minimalAmount && balance.gte(utils.parseEther(supportedToken.minimalAmount))) {
        return supportedToken.address;
      }
    }
    return null;
  }
}

import {BalanceChecker} from './BalanceChecker';
import {SupportedToken} from '../../core/models/relayer';

export class RequiredBalanceChecker {
  constructor(private balanceChecker: BalanceChecker) {}

  async findTokenWithRequiredBalance(supportedTokens: SupportedToken[], contractAddress: string) {
    for (const supprotedToken of supportedTokens) {
      const balance = await this.balanceChecker.getBalance(contractAddress, supprotedToken.address);
      if (balance.gte(supprotedToken.minimalAmount)) {
        return supprotedToken.address;
      }
    }
    return null;
  }
}

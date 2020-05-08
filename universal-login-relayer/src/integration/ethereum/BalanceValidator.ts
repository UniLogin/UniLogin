import {BalanceChecker, ensure} from '@unilogin/commons';
import {NotEnoughBalance} from '../../core/utils/errors';
import {BigNumber} from 'ethers/utils';

export class BalanceValidator {
  constructor(private balanceChecker: BalanceChecker) {}

  async validate(contractAddress: string, tokenAddress: string, minimalAmountInToken: BigNumber) {
    const balance = await this.balanceChecker.getBalance(contractAddress, tokenAddress);
    ensure(balance.gte(minimalAmountInToken), NotEnoughBalance);
  }
};

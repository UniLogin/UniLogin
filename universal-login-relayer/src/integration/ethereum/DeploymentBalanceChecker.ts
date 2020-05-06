import {BalanceChecker, ensure} from '@unilogin/commons'
import {NotEnoughBalance} from '../../core/utils/errors';
import {BigNumber} from 'ethers/utils';

export class DeploymentBalanceChecker{
  constructor(private balanceChecker: BalanceChecker) {}

  async validateBalance(contractAddress: string, tokenAddress: string, gasPriceInToken: BigNumber){
    const balanceChecked = await this.balanceChecker.getBalance(contractAddress, tokenAddress);
    ensure(balanceChecked.gte(gasPriceInToken), NotEnoughBalance);
    return balanceChecked;
  }
};
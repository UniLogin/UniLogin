import {utils} from 'ethers';
import {TokenDetailsWithBalance} from '../models/TokenData';
import {ValueRounder, ValuePresenter} from '../..';

export const getBalanceOf = (symbol: string, tokensDetailsWithBalance: TokenDetailsWithBalance[]) => {
  const tokens = tokensDetailsWithBalance.find((details) => details.symbol === symbol);
  return tokens === undefined ? null : ValuePresenter.presentRoundedValue(utils.formatEther(tokens.balance), ValueRounder.floor);
};

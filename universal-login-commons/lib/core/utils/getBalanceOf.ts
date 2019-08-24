import {utils} from 'ethers';
import {TokenDetailsWithBalance} from '../models/TokenData';

  export const getBalanceOf = (symbol: string, tokensDetailsWithBalance: TokenDetailsWithBalance[]) => {
    const tokens = tokensDetailsWithBalance.find((details) => details.symbol === symbol);
    return tokens === undefined ? null : utils.formatEther(tokens.balance);
  };

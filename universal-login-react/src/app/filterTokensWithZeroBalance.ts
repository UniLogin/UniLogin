import {TokenDetailsWithBalance} from '@unilogin/commons';

export const filterTokensWithZeroBalance = (tokens: TokenDetailsWithBalance[]) =>
  tokens.filter((token) => !token.balance.isZero());

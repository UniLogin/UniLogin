import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {useState} from 'react';
import {TokenDetailsWithBalance} from '@unilogin/commons';
import {useAsyncEffect} from './useAsyncEffect';

type GetBalanceBySymbol = (symbol: string) => TokenDetailsWithBalance | undefined;

export const useBalances = (deployedWallet: DeployedWithoutEmailWallet): [TokenDetailsWithBalance[], GetBalanceBySymbol] => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  useAsyncEffect(() => deployedWallet.subscribeToBalances(setTokenDetailsWithBalance), []);
  const getBalanceBySymbol = (symbol: string) => tokenDetailsWithBalance.find((token: TokenDetailsWithBalance) => token.symbol === symbol);
  return [tokenDetailsWithBalance, getBalanceBySymbol];
};

import {DeployedWallet} from '@unilogin/sdk';
import {useState} from 'react';
import {TokenDetailsWithBalance} from '@unilogin/commons';
import {useAsyncEffect} from './useAsyncEffect';

export const useBalances = (deployedWallet: DeployedWallet): [TokenDetailsWithBalance[], (symbol: string) => TokenDetailsWithBalance | undefined] => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  useAsyncEffect(() => deployedWallet.subscribeToBalances(setTokenDetailsWithBalance), []);
  const getBalanceBySymbol = (symbol: string) => tokenDetailsWithBalance.find((token: TokenDetailsWithBalance) => token.symbol === symbol);
  return [tokenDetailsWithBalance, getBalanceBySymbol];
};

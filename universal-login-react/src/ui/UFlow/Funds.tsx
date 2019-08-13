import React, {useState} from 'react';
import {useServices} from '../../core/services/useServices';
import {TokenDetailsWithBalance, CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {TokenAsset} from './TokenAsset';

interface FundsProps {
  ensName: string;
}

export const Funds = ({ensName}: FundsProps) => {
  const {sdk} = useServices();
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setTotalTokensValue), []);

  return (
    <div>
      <div>
        Total: ${totalTokensValue['USD']}
      </div>
      <div>
        My assets:
      </div>
      {
        tokenDetailsWithBalance.map((token: TokenDetailsWithBalance) => (
          <TokenAsset token={token} key={token.symbol}/>
          ))
        }
    </div>
    );
};

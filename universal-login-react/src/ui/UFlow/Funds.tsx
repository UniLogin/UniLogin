import React, {useState, useContext} from 'react';
import {useServices} from '../../core/services/useServices';
import {TokenDetailsWithBalance, CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {TokenAsset} from './TokenAsset';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';

interface FundsProps {
  ensName: string;
}

export const Funds = ({ensName}: FundsProps) => {
  const modalService = useContext(ReactUModalContext);
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);
  const {sdk} = useServices();

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);
  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setTotalTokensValue), []);

  return (
    <div>
      <div>
        Total: ${totalTokensValue['USD']}
      </div>
      <div>
        <button onClick={() => modalService.showModal('topup')}>topUp</button>
        <button onClick={() => modalService.showModal('transfer')}>send</button>
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

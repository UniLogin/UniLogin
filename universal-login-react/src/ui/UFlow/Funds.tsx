import React, {useState, useContext} from 'react';
import {TokenDetailsWithBalance, CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {TokenAsset} from './TokenAsset';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import UniversalLoginSDK from '@universal-login/sdk';

interface FundsProps {
  ensName: string;
  sdk: UniversalLoginSDK;
}

export const Funds = ({ensName, sdk}: FundsProps) => {
  const modalService = useContext(ReactUModalContext);
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

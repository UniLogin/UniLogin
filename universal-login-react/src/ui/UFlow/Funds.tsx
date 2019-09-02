import React, {useState} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import UniversalLoginSDK from '@universal-login/sdk';
import {Balance} from '../commons/Balance';
import {Assets} from '../commons/Assets';

interface FundsProps {
  ensName: string;
  sdk: UniversalLoginSDK;
  onTopUpClick: () => void;
  onSendClick: () => void;
}

export const Funds = ({ensName, sdk, onTopUpClick, onSendClick}: FundsProps) => {
  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);

  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setTotalTokensValue), []);

  return (
    <div className="udashboard-funds">
        <Balance amount={`$${totalTokensValue['USD'] || '0.00'}`} />
      <div className="udashboard-funds-buttons">
        <button className="udashboard-funds-btn udashboard-funds-topup" onClick={onTopUpClick}>Top-up</button>
        <button className="udashboard-funds-btn udashboard-funds-send" onClick={onSendClick}>Send</button>
      </div>
      <Assets sdk={sdk} ensName={ensName} />
    </div>
  );
};

import React, {useState} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import UniversalLoginSDK from '@universal-login/sdk';
import {Balance} from '../commons/Balance';
import {Assets} from '../commons/Assets';
const Blockies = require('react-blockies').default;

interface FundsProps {
  contractAddress: string;
  ensName: string;
  sdk: UniversalLoginSDK;
  onTopUpClick: () => void;
  onSendClick: () => void;
}

export const Funds = ({contractAddress, ensName, sdk, onTopUpClick, onSendClick}: FundsProps) => {
  const [totalTokensValue, setTotalTokensValue] = useState<CurrencyToValue>({} as CurrencyToValue);

  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setTotalTokensValue), []);

  return (
    <div className="udashboard-funds">
      <div className="udashboard-ens-name-row">
        <Blockies seed={contractAddress} size={8} scale={4} />
        <p className="udashboard-ens-name">{ensName}</p>
      </div>
      <Balance amount={`$${totalTokensValue['USD'] || '0.00'}`} />
      <div className="udashboard-funds-buttons">
        <button className="udashboard-funds-btn udashboard-funds-topup" onClick={onTopUpClick}>Top-up</button>
        <button className="udashboard-funds-btn udashboard-funds-send" onClick={onSendClick}>Send</button>
      </div>
      <Assets sdk={sdk} ensName={ensName} />
    </div>
  );
};

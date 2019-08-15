import React, {useState} from 'react';
import {CurrencyToValue} from '@universal-login/commons';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import UniversalLoginSDK from '@universal-login/sdk';

export interface DropdownItemProps {
  sdk: UniversalLoginSDK;
  ensName: string;
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({sdk, ensName, className, name, symbol, balance, icon, onClick}: DropdownItemProps) => {
  const [usdAmount, setUsdAmount] = useState<string>('');

  const setUsdAmountCallback = (tokenTotalWorth: CurrencyToValue) => setUsdAmount(tokenTotalWorth['USD'].toString());

  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(ensName, setUsdAmountCallback), []);

  return (
    <button onClick={() => onClick(symbol)} className={className || 'currency-accordion-item'}>
      <div className="currency-accordion-left">
        <img src={icon} alt={symbol} className="currency-accordion-img" />
        <p className="currency-accordion-name">{name}</p>
      </div>
      <div className="currency-accordion-right">
        <p className="currency-accordion-amount">{balance} {symbol}</p>
        <p className="currency-accordion-amount-usd">${usdAmount}</p>
      </div>
    </button>
  );
};

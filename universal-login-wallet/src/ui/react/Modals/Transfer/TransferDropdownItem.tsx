import React, {useState} from 'react';
import {useServices, useAsyncEffect} from '../../../hooks';

interface DropdownItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({className, name, symbol, balance, icon, onClick}: DropdownItemProps) => {
  const {sdk, walletPresenter} = useServices();
  const [usdAmount, setUsdAmount] = useState<string>('');

  useAsyncEffect(() => sdk.subscribeToAggregatedBalance(walletPresenter.getName(), setUsdAmount, symbol), []);

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

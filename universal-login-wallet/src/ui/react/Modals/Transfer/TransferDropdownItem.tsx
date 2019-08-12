import React, {useState, useEffect} from 'react';
import {useServices} from '../../../hooks';

interface DropdownItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  iconForToken: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({className, name, symbol, balance, iconForToken, onClick}: DropdownItemProps) => {
  const {sdk, walletPresenter} = useServices();
  const [usdAmount, setUsdAmount] = useState<string>('');

  useEffect(() => {
    const promise = sdk.subscribeToAggregatedBalance(walletPresenter.getName(), setUsdAmount, symbol);
    return () => {
      promise.then((unsubscribe: () => void) => unsubscribe());
    };
  }, []);

  return (
    <button onClick={() => onClick(symbol)} className={className || 'currency-accordion-item'}>
      <div className="currency-accordion-left">
        <img src={iconForToken} alt={symbol} className="currency-accordion-img" />
        <p className="currency-accordion-name">{name}</p>
      </div>
      <div className="currency-accordion-right">
        <p className="currency-accordion-amount">{balance} {symbol}</p>
        <p className="currency-accordion-amount-usd">${usdAmount}</p>
      </div>
    </button>
  );
};

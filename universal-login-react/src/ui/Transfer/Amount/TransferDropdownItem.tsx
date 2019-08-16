import React, {useState, useEffect} from 'react';
import {TokensPrices} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

export interface DropdownItemProps {
  sdk: UniversalLoginSDK;
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({sdk, className, name, symbol, balance, icon, onClick}: DropdownItemProps) => {
  const [usdAmount, setUsdAmount] = useState<string>('');

  useEffect(() => {
    const unsubscribe = sdk.subscribeToPrices((tokensPrices: TokensPrices) => {
      const tokenPrice = tokensPrices[symbol] === undefined ? 0 : tokensPrices[symbol]['USD'];
      const tokenValue = tokenPrice * Number(balance);
      setUsdAmount(tokenValue.toString());
    });
    return unsubscribe;
  }, []);

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

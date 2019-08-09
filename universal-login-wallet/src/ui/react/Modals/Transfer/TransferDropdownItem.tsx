import React, {useState, useEffect} from 'react';
import daiIcon from '../../../assets/icons/dai.svg';
import ethIcon from '../../../assets/icons/ethereum.svg';
import {useServices} from '../../../hooks';

interface DropdownItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({className, name, symbol, balance, onClick}: DropdownItemProps) => {
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
        <img src={symbol === 'ETH' ? ethIcon : daiIcon} alt="dai" className="currency-accordion-img" />
        <p className="currency-accordion-name">{name}</p>
      </div>
      <div className="currency-accordion-right">
        <p className="currency-accordion-amount">{balance} {symbol}</p>
        <p className="currency-accordion-amount-usd">${usdAmount}</p>
      </div>
    </button>
  );
};

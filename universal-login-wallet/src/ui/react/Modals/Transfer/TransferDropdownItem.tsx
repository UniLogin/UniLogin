import React from 'react';
import daiIcon from '../../../assets/icons/dai.svg';
import ethIcon from '../../../assets/icons/ethereum.svg';

interface DropdownItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferDropdownItem = ({className, name, symbol, balance, onClick}: DropdownItemProps) => (
  <button onClick={() => onClick(symbol)} className={className || 'currency-accordion-item'}>
    <div className="currency-accordion-left">
      <img src={symbol === 'ETH' ? ethIcon : daiIcon} alt="dai" className="currency-accordion-img" />
      <p className="currency-accordion-name">{name}</p>
    </div>
    <div className="currency-accordion-right">
      <p className="currency-accordion-amount">{balance} {symbol}</p>
      <p className="currency-accordion-amount-usd">$--,--</p>
    </div>
  </button>
);

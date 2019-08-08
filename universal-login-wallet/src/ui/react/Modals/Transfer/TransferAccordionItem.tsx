import React from 'react';

interface AccordionItemProps {
  className?: string;
  name: string;
  symbol: string;
  balance: string;
  iconSrc: string;
  onClick: (transferCurrency: string) => void;
}

export const TransferAccordionItem = ({className, name, symbol, balance, iconSrc, onClick}: AccordionItemProps) => (
  <button onClick={() => onClick(symbol)} className={className || 'currency-accordion-item'}>
    <div className="currency-accordion-left">
      <img src={iconSrc} alt="dai" className="currency-accordion-img" />
      <p className="currency-accordion-name">{name}</p>
    </div>
    <div className="currency-accordion-right">
      <p className="currency-accordion-amount">{balance} {symbol}</p>
      <p className="currency-accordion-amount-usd">$--,--</p>
    </div>
  </button>
);

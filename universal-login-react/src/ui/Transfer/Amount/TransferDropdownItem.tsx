import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {Asset} from '../../commons/Asset';

export interface DropdownItemProps {
    sdk: UniversalLoginSDK;
    name: string;
    symbol: string;
    balance: string | null;
    icon: string;
    onClick: (transferCurrency: string) => void;
    className?: string;
  }

export const TransferDropdownItem = ({sdk, name, symbol, balance, icon, onClick, className}: DropdownItemProps) => {
  return (
    <button onClick={() => onClick(symbol)} className={className || 'currency-accordion-item'}>
      <Asset sdk={sdk} name={name} symbol={symbol} balance={balance} icon={icon}/>
    </button>
  );
};

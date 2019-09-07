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
    dropdownClassName: string;
    className?: string;
  }

export const TransferDropdownItem = ({sdk, name, symbol, balance, icon, onClick, className, dropdownClassName}: DropdownItemProps) => {
  return (
    <button onClick={() => onClick(symbol)} className={dropdownClassName}>
      <Asset
        sdk={sdk}
        name={name}
        symbol={symbol}
        balance={balance}
        icon={icon}
        className={className}
      />
    </button>
  );
};

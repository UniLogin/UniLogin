import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {Asset} from '../../commons/Asset';
import {TokenDetails} from '@universal-login/commons';

export interface DropdownItemProps {
    sdk: UniversalLoginSDK;
    tokenDetails: TokenDetails;
    balance: string | null;
    icon: string;
    onClick: (transferToken: TokenDetails) => void;
    dropdownClassName: string;
    className?: string;
  }

export const TransferDropdownItem = ({sdk, tokenDetails, balance, icon, onClick, className, dropdownClassName}: DropdownItemProps) => {
  return (
    <button onClick={() => onClick(tokenDetails)} className={dropdownClassName}>
      <Asset
        sdk={sdk}
        name={tokenDetails.name}
        symbol={tokenDetails.symbol}
        balance={balance}
        icon={icon}
        className={className}
      />
    </button>
  );
};

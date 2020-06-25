import React from 'react';
import UniLoginSdk from '@unilogin/sdk';
import {Asset} from '../../commons/Asset';
import {TokenDetails} from '@unilogin/commons';

export interface DropdownItemProps {
  sdk: UniLoginSdk;
  tokenDetails: TokenDetails;
  balance: string | null;
  onClick: (transferToken: TokenDetails) => void;
  dropdownClassName: string;
}

export const TransferDropdownItem = ({sdk, tokenDetails, balance, onClick, dropdownClassName}: DropdownItemProps) => {
  return (
    <button onClick={() => onClick(tokenDetails)} className={dropdownClassName}>
      <Asset
        sdk={sdk}
        token={tokenDetails}
        balance={balance}
      />
    </button>
  );
};

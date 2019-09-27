import React from 'react';
import {TokenDetails, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import daiIcon from '../../assets/icons/dai.svg';
import ethIcon from '../../assets/icons/ethereum.svg';
import {useToggler} from '../../hooks/useToggler';

interface TransferDropdownProps {
  sdk: UniversalLoginSDK;
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  currency: string;
  setCurrency: (currency: string) => void;
  className?: string;
}

export const TransferDropdown = ({sdk, tokenDetailsWithBalance, currency, setCurrency, className}: TransferDropdownProps) => {
  const {visible, toggle} = useToggler();

  const onClick = (currency: string) => {
    toggle();
    setCurrency(currency);
  };

  const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

  const renderTransferDropdownItems = (tokensDetails: TokenDetails[], predicate: (tokenDetails: TokenDetails) => boolean, dropdownClassName: string) =>
    tokensDetails
      .filter(predicate)
      .map(({symbol, name}: TokenDetails) => renderTransferDropdownItem(symbol, name, dropdownClassName));

  const renderTransferDropdownItem = (symbol: string, name: string, dropdownClassName: string) => (
    <TransferDropdownItem
      key={`${name}-${symbol}`}
      sdk={sdk}
      dropdownClassName={dropdownClassName}
      className={className}
      name={name}
      symbol={symbol}
      icon={iconForToken(symbol)}
      balance={getBalanceOf(symbol, tokenDetailsWithBalance)}
      onClick={onClick}
    />
  );

  return (
    <div className="currency-accordion">
        {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol === currency, `currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`)}
        {visible &&
          <div className="currency-scrollable-list">
            {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol !== currency, 'currency-accordion-item')}
          </div>}
    </div >
  );
};

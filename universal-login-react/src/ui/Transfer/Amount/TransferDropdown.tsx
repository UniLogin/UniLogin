import React, {useState} from 'react';
import {TokenDetails, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import daiIcon from '../../assets/icons/dai.svg';
import ethIcon from '../../assets/icons/ethereum.svg';
import {useToggler} from '../../hooks/useToggler';

interface TransferDropdownProps {
  sdk: UniversalLoginSDK;
  ensName: string;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const TransferDropdown = ({sdk, ensName, currency, setCurrency}: TransferDropdownProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const {visible, toggle} = useToggler();

  useAsyncEffect(() => sdk.subscribeToBalances(ensName, setTokenDetailsWithBalance), []);

  const onClick = (currency: string) => {
    toggle();
    setCurrency(currency);
  };

  const iconForToken = (symbol: string) => symbol === 'ETH' ? ethIcon : daiIcon;

  const renderTransferDropdownItems = (tokensDetails: TokenDetails[], predicate: (tokenDetails: TokenDetails) => boolean, className?: string) =>
    tokensDetails
      .filter(predicate)
      .map(({symbol, name}: TokenDetails) => renderTransferDropdownItem(symbol, name, className));

  const renderTransferDropdownItem = (symbol: string, name: string, className?: string) => (
    <TransferDropdownItem
      key={`${name}-${symbol}`}
      sdk={sdk}
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
      {visible && renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol !== currency)}
    </div >
  );
};

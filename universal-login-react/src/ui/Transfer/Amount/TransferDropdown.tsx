import React from 'react';
import {TokenDetails, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import {useToggler} from '../../hooks/useToggler';
import {getIconForToken} from '../../../core/utils/getIconForToken';

interface TransferDropdownProps {
  sdk: UniversalLoginSDK;
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  tokenDetails: TokenDetails;
  setToken: (token: TokenDetails) => void;
  className?: string;
}

export const TransferDropdown = ({sdk, tokenDetailsWithBalance, tokenDetails, setToken, className}: TransferDropdownProps) => {
  const {visible, toggle} = useToggler();

  const onClick = (token: TokenDetails) => {
    toggle();
    setToken(token);
  };

  const renderTransferDropdownItems = (tokensDetails: TokenDetails[], predicate: (tokenDetails: TokenDetails) => boolean, dropdownClassName: string) =>
    tokensDetails
      .filter(predicate)
      .map((tokenDetails: TokenDetails) => renderTransferDropdownItem(tokenDetails, dropdownClassName));

  const renderTransferDropdownItem = (tokenDetails: TokenDetails, dropdownClassName: string) => (
    <TransferDropdownItem
      key={`${tokenDetails.name}-${tokenDetails.symbol}`}
      sdk={sdk}
      dropdownClassName={dropdownClassName}
      className={className}
      tokenDetails={tokenDetails}
      icon={getIconForToken(tokenDetails.symbol)}
      balance={getBalanceOf(tokenDetails.symbol, tokenDetailsWithBalance)}
      onClick={onClick}
    />
  );

  return (
    <div className="currency-accordion">
      {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol === tokenDetails.symbol, `currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`)}
      {visible &&
          <div className="currency-scrollable-list">
            {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol !== tokenDetails.symbol, 'currency-accordion-item currency-accordion-item-list')}
          </div>}
    </div >
  );
};

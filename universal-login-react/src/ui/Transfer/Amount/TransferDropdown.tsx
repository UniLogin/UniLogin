import React, {useRef} from 'react';
import {TokenDetails, TokenDetailsWithBalance, getBalanceOf} from '@unilogin/commons';
import UniLoginSdk from '@unilogin/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import {useToggler} from '../../hooks/useToggler';
import {getIconForToken} from '../../../core/utils/getIconForToken';
import {useOutsideClick} from '../../hooks/useClickOutside';
import '../../styles/themes/Jarvis/components/currencyDropdownThemeJarvis.sass';

interface TransferDropdownProps {
  sdk: UniLoginSdk;
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  tokenDetails: TokenDetails;
  setToken: (token: TokenDetails) => void;
}

export const TransferDropdown = ({sdk, tokenDetailsWithBalance, tokenDetails, setToken}: TransferDropdownProps) => {
  const {visible, toggle} = useToggler();
  const ref = useRef(null);
  useOutsideClick(ref, () => toggle(false));

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
      tokenDetails={tokenDetails}
      icon={getIconForToken(tokenDetails.symbol)}
      balance={getBalanceOf(tokenDetails.symbol, tokenDetailsWithBalance)}
      onClick={onClick}
    />
  );

  return (
    <div ref={ref} className="currency-accordion">
      {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol === tokenDetails.symbol, `currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`)}
      {visible &&
        <div className={`currency-scrollable-list ${sdk.tokensDetailsStore.tokensDetails.length <= 2 ? 'one' : 'many'}`}>
          {renderTransferDropdownItems(sdk.tokensDetailsStore.tokensDetails, ({symbol}) => symbol !== tokenDetails.symbol, 'currency-accordion-item currency-accordion-item-list')}
        </div>}
    </div>
  );
};

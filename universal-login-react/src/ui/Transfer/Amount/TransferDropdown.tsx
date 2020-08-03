import React, {useRef} from 'react';
import {utils} from 'ethers';
import {TokenDetails, TokenDetailsWithBalance, ValueRounder} from '@unilogin/commons';
import UniLoginSdk from '@unilogin/sdk';
import {TransferDropdownItem} from './TransferDropdownItem';
import {useToggler} from '../../hooks/useToggler';
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

  const renderTransferDropdownItems = (tokensDetails: TokenDetailsWithBalance[], predicate: (tokenDetails: TokenDetails) => boolean, dropdownClassName: string) =>
    tokensDetails
      .filter(predicate)
      .map((tokenDetails: TokenDetailsWithBalance) => renderTransferDropdownItem(tokenDetails, dropdownClassName));

  const renderTransferDropdownItem = (tokenDetails: TokenDetailsWithBalance, dropdownClassName: string) => (
    <TransferDropdownItem
      key={`${tokenDetails.name}-${tokenDetails.symbol}`}
      sdk={sdk}
      dropdownClassName={dropdownClassName}
      tokenDetails={tokenDetails}
      balance={ValueRounder.floor(utils.formatUnits(tokenDetails.balance, tokenDetails.decimals))}
      onClick={onClick}
    />
  );

  return (
    <div ref={ref} className="currency-accordion">
      {renderTransferDropdownItems(tokenDetailsWithBalance, ({symbol}) => symbol === tokenDetails.symbol, `currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`)}
      {visible &&
        <div className={`currency-scrollable-list ${tokenDetailsWithBalance.length <= 2 ? 'one' : 'many'}`}>
          {renderTransferDropdownItems(tokenDetailsWithBalance, ({symbol}) => symbol !== tokenDetails.symbol, 'currency-accordion-item currency-accordion-item-list')}
        </div>}
    </div>
  );
};

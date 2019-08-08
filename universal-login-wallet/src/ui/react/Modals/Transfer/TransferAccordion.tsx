import React, {useState} from 'react';
import daiIcon from '../../../assets/icons/dai.svg';
import ethereumIcon from '../../../assets/icons/ethereum.svg';
import {TransferAccordionItem} from './TransferAccordionItem';

export const TransformAccordion = () => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <div className="currency-accordion">
      <TransferAccordionItem
        className={`currency-accordion-btn currency-accordion-item ${dropdownVisibility ? 'expaned' : ''}`}
        name="Ethereum"
        symbol="ETH"
        balance="0,8"
        iconSrc={ethereumIcon}
        onClick={() => setDropdownVisibility(!dropdownVisibility)}
      />
      {
    dropdownVisibility &&
    <div className="currency-accordion-content">
      <TransferAccordionItem iconSrc={daiIcon} name="Dai" symbol="DAI" balance="12312,76" onClick={() => setDropdownVisibility(!dropdownVisibility)} />
    </div>
  }
    </div >
  );
};

import React from 'react';
import daiIcon from '../../../assets/icons/dai.svg';
import ethereumIcon from '../../../assets/icons/ethereum.svg';
import {TransferAccordionItem} from './TransferAccordionItem';
import {useToggler} from '../../../hooks';

export const TransformAccordion = () => {
  const {visible, toggle} = useToggler();

  return (
    <div className="currency-accordion">
      <TransferAccordionItem
        className={`currency-accordion-btn currency-accordion-item ${visible ? 'expaned' : ''}`}
        name="Ethereum"
        symbol="ETH"
        balance="0,8"
        iconSrc={ethereumIcon}
        onClick={toggle}
      />
      {
    visible &&
    <div className="currency-accordion-content">
      <TransferAccordionItem iconSrc={daiIcon} name="Dai" symbol="DAI" balance="12312,76" onClick={toggle} />
    </div>
  }
    </div >
  );
};

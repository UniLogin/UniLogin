import React, {useState} from 'react';
import daiIcon from '../../../assets/icons/dai.svg';
import ethereumIcon from '../../../assets/icons/ethereum.svg';

export const TransformAccordion = () => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <div className="currency-accordion">
      <button
        className={`currency-accordion-btn currency-accordion-item ${dropdownVisibility ? 'expaned' : ''}`}
        onClick={() => setDropdownVisibility(!dropdownVisibility)}
      >
        <div className="currency-accordion-left">
          <img src={ethereumIcon} alt="ethereum" className="currency-accordion-img" />
          <p className="currency-accordion-name">Ethereum</p>
        </div>
        <div className="currency-accordion-right">
          <p className="currency-accordion-amount">0,8 ETH</p>
          <p className="currency-accordion-amount-usd">$160</p>
        </div>
      </button>
      {dropdownVisibility &&
        <div className="currency-accordion-content">
          <button onClick={() => setDropdownVisibility(false)} className="currency-accordion-item">
            <div className="currency-accordion-left">
              <img src={daiIcon} alt="dai" className="currency-accordion-img" />
              <p className="currency-accordion-name">Dai</p>
            </div>
            <div className="currency-accordion-right">
              <p className="currency-accordion-amount">12312,76 DAI</p>
              <p className="currency-accordion-amount-usd">$12227,43</p>
            </div>
          </button>
        </div>
      }
    </div>
  );
};

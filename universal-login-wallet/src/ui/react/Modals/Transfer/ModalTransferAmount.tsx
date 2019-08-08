import React, {useState} from 'react';
import {Input} from '@universal-login/react';
import InputLabel from '../../common/InputLabel';
import daiIcon from '../../../assets/icons/dai.svg';
import ethereumIcon from '../../../assets/icons/ethereum.svg';

export interface ModalTransferAmountProps {
  onSelectRecipientClick: () => void;
  onAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ModalTransferAmount = ({onSelectRecipientClick, onAmountInputChange}: ModalTransferAmountProps) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <div className="transfer-modal">
      <div className="box-header">
        <h2 className="box-title">Send</h2>
      </div>
      <div className="modal-content">


        <div className="transfer-modal-inner">
          <div className="currency-accordion">
            <button
              className={`currency-accordion-btn currency-accordion-item ${dropdownVisibility ? 'expaned' : ''}`}
              onClick={() => setDropdownVisibility(!dropdownVisibility)}
            >
              <div className="currency-accordion-left">
                <img src={ethereumIcon} alt="ethereum" className="currency-accordion-img"/>
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
                    <img src={daiIcon} alt="dai" className="currency-accordion-img"/>
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
          <div className="transfer-modal-row">
            <InputLabel className="transfer-modal-label" htmlFor="amount-eth">How much are you sending?</InputLabel>
            <button className="transfer-max-btn">Max</button>
          </div>
          <div className="transfer-input-wrapper">
            <Input
              id="amount-eth"
              type="number"
              className="transfer-modal-amount"
              onChange={onAmountInputChange}
            />
            <span className="currency-code">ETH</span>
          </div>
          <button id="select-recipient" onClick={onSelectRecipientClick}  className="modal-nav-btn">
            <span>Select recipient</span>
          </button>
        </div>
      </div>
    </div>
  );
};

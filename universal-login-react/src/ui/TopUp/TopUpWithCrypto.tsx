import React from 'react';
import './../styles/topUpModalDefaults.css';
import ethereumIcon from './../assets/icons/ethereum.svg';
import copyIcon from './../assets/icons/copy.svg';
import {copy} from '@universal-login/commons';

interface TopUpWithCryptoProps {
  contractAddress: string;
  topUpClassname?: string;
}

export const TopUpWithCrypto = ({contractAddress, topUpClassname}: TopUpWithCryptoProps) => {
  return(
    <div className={`topup ${topUpClassname ? topUpClassname : 'universal-login-topup'}`}>
      <h2 className="topup-title">Transfer one of following</h2>
      <p className="topup-subtitle">With minimum amount</p>
      <div className="address-modal-row">
        <div className="address-modal-block">
          <img src={ethereumIcon} alt="ethereum icon" className="address-modal-coin"/>
          <p className="address-modal-amount">0,005 ETH</p>
        </div>
      </div>
      <label htmlFor="input-address" className="input-label">To following address</label>
      <div className="input-address-wrapper">
        <input
          id="contract-address"
          className="input-address"
          defaultValue={contractAddress}
        />
        <button onClick={() => copy('contract-address')} className="address-copy-btn">
          <img src={copyIcon} alt="copy"/>
        </button>
      </div>
      <p className="address-modal-text">The cost of wallet creation will be: 0,002 ETH. Transfer will be automatically discovered.</p>
    </div>
  );
};

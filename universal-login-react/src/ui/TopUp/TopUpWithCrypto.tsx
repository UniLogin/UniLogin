import React, {useState, useEffect} from 'react';
import './../styles/topUpModalDefaults.css';
import {copy} from '@universal-login/commons';

interface TopUpWithCryptoProps {
  contractAddress: string;
}

export const TopUpWithCrypto = ({contractAddress}: TopUpWithCryptoProps) => {
  const [cryptoClass, setCryptoClass] = useState('');

  useEffect(() => {
    setCryptoClass('crypto-selected');
  }, []);

  return(
    <div className={`crypto ${cryptoClass}`}>
      <label htmlFor="input-address" className="top-up-label">Send to</label>
      <div className="input-address-wrapper">
        <input
          id="contract-address"
          className="input-address"
          onChange={() => {}}
          defaultValue={contractAddress}
          readOnly
        />
        <button onClick={() => copy('contract-address')} className="address-copy-btn">
          <span className="address-copy-btn-copy-alert">Copied</span>
        </button>
      </div>
      <p className="info-text">Minimum amount is 0.005 ETH or 2 dai</p>
    </div>
  );
};

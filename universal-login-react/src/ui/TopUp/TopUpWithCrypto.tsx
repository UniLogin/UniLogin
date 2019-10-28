import React, {useState, useEffect} from 'react';
import {copy} from '@universal-login/commons';
import {QRCode} from 'react-qr-svg';

interface TopUpWithCryptoProps {
  contractAddress: string;
  isDeployment: boolean;
}

export const TopUpWithCrypto = ({contractAddress, isDeployment}: TopUpWithCryptoProps) => {
  const [cryptoClass, setCryptoClass] = useState('');

  useEffect(() => {
    setCryptoClass('crypto-selected');
  }, []);

  return (
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
        <button onClick={() => copy('contract-address')} className="copy-btn">
          <span className="copy-btn-feedback" />
        </button>
      </div>
      <div className="qr-code-wrapper">
        <QRCode
          level="M"
          bgColor="#ffffff"
          fgColor="#120839"
          width={128}
          height={128}
          value={contractAddress}
        />
      </div>
      {isDeployment &&
        <>
          <p className="info-text">Send 0.005 ETH or 2 dai to this address</p>
          <p className="info-text">This screen will update itself as soon as we detect an upcoming transaction</p>
        </>
      }
    </div>
  );
};

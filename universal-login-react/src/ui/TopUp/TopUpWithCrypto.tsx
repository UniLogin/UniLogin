import React, {useState, useEffect} from 'react';
import {QRCode} from 'react-qr-svg';
import {copy} from '@universal-login/commons';
import {WalletService} from '@universal-login/sdk';

interface TopUpWithCryptoProps {
  walletService: WalletService;
}

const DeploymentWithCryptoInfo = ({minimalAmount}: {minimalAmount?: string}) =>
  <>
    <p className="info-text">Send at least {minimalAmount || '...'} ETH to this address</p>
    <p className="info-text">This screen will update itself as soon as we detect a mined transaction</p>
  </>;

const TopUpCryptoInfo = () =>
  <>
    <p className="info-text">All your Ethereum tokens have the same address</p>
    <p className="info-text">Only send Ethereum tokens to this address</p>
  </>;

export const TopUpWithCrypto = ({walletService}: TopUpWithCryptoProps) => {
  const [cryptoClass, setCryptoClass] = useState('');
  const contractAddress = walletService.getContractAddress();

  useEffect(() => {
    setCryptoClass('crypto-selected');
  }, []);

  return (
    <div className="top-up-body">
      <div className="top-up-body-inner">
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
              <p className="copy-btn-feedback">Copied</p>
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
          {walletService.isKind('Future')
            ? <DeploymentWithCryptoInfo minimalAmount={walletService.getRequiredDeploymentBalance()}/>
            : <TopUpCryptoInfo/>
          }
        </div>
      </div>
    </div>
  );
};

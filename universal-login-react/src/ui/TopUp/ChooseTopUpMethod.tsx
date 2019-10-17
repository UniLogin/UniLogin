import React, {useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import daiIcon from './../assets/topUp/tokensIcons/DAI.svg';
import EthereumIcon from './../assets/topUp/tokensIcons/ETH.svg';
import cardIcon from './../assets/topUp/card.svg';
import bankIcon from './../assets/topUp/bank.svg';
import {TopUpRadio} from './TopUpRadio';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {TopUpProvider} from '../../core/models/TopUpProvider';

export interface ChooseTopUpMethodProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  topUpClassName?: string;
  logoColor?: LogoColor;
  isDeployment: boolean;
}

export const ChooseTopUpMethod = ({sdk, contractAddress, onPayClick, topUpClassName, logoColor, isDeployment}: ChooseTopUpMethodProps) => {
  const [topUpMethod, setTopUpMethod] = useState('');

  const methodSelectedClassName = topUpMethod !== '' ? 'method-selected' : '';

  return (
    <div className="universal-login-topup">
      <div className={`${getStyleForTopLevelComponent(topUpClassName)}`}>
        <div className={`top-up ${methodSelectedClassName}`}>
          <div className="top-up-header">
            <h2 className="top-up-title">Choose a top-up method</h2>
            <div className="top-up-methods">
              <TopUpRadio
                id="topup-btn-crypto"
                onClick={() => setTopUpMethod('crypto')}
                checked={topUpMethod === 'crypto'}
                name="top-up-method"
                className={`top-up-method ${topUpMethod === 'crypto' ? 'active' : ''}`}
              >
                <div className="top-up-method-icons">
                  <img className="top-up-method-icon" src={daiIcon} alt="Dai"/>
                  <img className="top-up-method-icon" src={EthereumIcon} alt="Ethereum"/>
                </div>
                <p className="top-up-method-title">Crypto</p>
                <p className="top-up-method-text">Free-Deposit ETH or DAI</p>
              </TopUpRadio>
              <TopUpRadio
                id="topup-btn-fiat"
                onClick={() => setTopUpMethod('fiat')}
                checked={topUpMethod === 'fiat'}
                name="top-up-method"
                className={`top-up-method ${topUpMethod === 'fiat' ? 'active' : ''}`}
              >
                <div className="top-up-method-icons">
                  <img className="top-up-method-icon" src={cardIcon} alt="card"/>
                  <img className="top-up-method-icon" src={bankIcon} alt="Dai"/>
                </div>
                <p className="top-up-method-title">Fiat</p>
                <p className="top-up-method-text">Buy using credit card or bank account</p>
              </TopUpRadio>

            </div>
          </div>
          <div className="top-up-body">
            <div className="top-up-body-inner">
              {topUpMethod === 'crypto' && <TopUpWithCrypto contractAddress={contractAddress} isDeployment={isDeployment}/>}
              {topUpMethod === 'fiat' && <TopUpWithFiat sdk={sdk} onPayClick={onPayClick} logoColor={logoColor}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

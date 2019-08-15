import React, {useState} from 'react';
import './../styles/topup.css';
import './../styles/topUpModalDefaults.css';
import daiIcon from './../assets/icons/dai.svg';
import EthereumIcon from './../assets/icons/ethereum.svg';
import cardIcon from './../assets/icons/card.svg';
import {TopUpRadio} from './TopUpRadio';
import {TopUpWithFiat} from './TopUpWithFiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {OnRampConfig} from '@universal-login/commons';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';

export interface ChooseTopUpMethodProps {
  contractAddress: string;
  onPayClick: (topUpModalType: TopUpComponentType, amount: string) => void;
  topUpClassName?: string;
  hideModal?: () => void;
}

export const ChooseTopUpMethod = ({contractAddress, onPayClick, hideModal, topUpClassName}: ChooseTopUpMethodProps) => {
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
                className="top-up-method"
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
                className="top-up-method"
              >
                <div className="top-up-method-icons">
                  <img className="top-up-method-icon" src={cardIcon} alt="card"/>
                </div>
                <p className="top-up-method-title">Fiat</p>
                <p className="top-up-method-text">Buy using credit card or bank account</p>
              </TopUpRadio>

            </div>
          </div>
          <div className="top-up-body">
            <div className="top-up-body-inner">
              {topUpMethod === 'crypto' && <TopUpWithCrypto contractAddress={contractAddress} />}
              {topUpMethod === 'fiat' && <TopUpWithFiat contractAddress={contractAddress} onPayClick={onPayClick}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

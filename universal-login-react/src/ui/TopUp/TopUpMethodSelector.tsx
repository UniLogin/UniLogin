import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpRadio} from './TopUpRadio';
import daiIcon from '../assets/topUp/tokensIcons/DAI.svg';
import EthereumIcon from '../assets/topUp/tokensIcons/ETH.svg';
import cardIcon from '../assets/topUp/card.svg';
import bankIcon from '../assets/topUp/bank.svg';
import React from 'react';

export interface TopUpMethodSelectorProps {
  value: TopUpMethod;
  onChange: (value: TopUpMethod) => void;
}

export const TopUpMethodSelector = ({value, onChange}: TopUpMethodSelectorProps) => (
  <div className="top-up-header">
    <h2 className="top-up-title">Choose a top-up method</h2>
    <div className="top-up-methods">
      <TopUpRadio
        id="topup-btn-crypto"
        onClick={() => onChange('crypto')}
        checked={value === 'crypto'}
        name="top-up-method"
        className={`top-up-method ${value === 'crypto' ? 'active' : ''}`}
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
        onClick={() => onChange('fiat')}
        checked={value === 'fiat'}
        name="top-up-method"
        className={`top-up-method ${value === 'fiat' ? 'active' : ''}`}
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
);

import React, {ReactNode} from 'react';
import daiIcon from './../assets/topUp/tokensIcons/DAI.svg';
import EthereumIcon from './../assets/topUp/tokensIcons/ETH.svg';
import cardIcon from './../assets/topUp/card.svg';
import bankIcon from './../assets/topUp/bank.svg';
import {Omit} from '@universal-login/commons';

export interface TopUpRadioProps {
  onClick: () => void;
  checked: boolean;
  className?: string;
  children: ReactNode;
  name: string;
  id?: string;
}

export const TopUpRadio = ({id, onClick, checked, children, className, name}: TopUpRadioProps) => (
  <label
    id={id}
    onClick={onClick}
    className={`top-up-radio-label ${className || ''}`}
  >
    <input
      className="top-up-radio"
      type="radio"
      name={name}
      checked={checked}
      readOnly
    />
    <div className="top-up-radio-inner">
      {children}
    </div>
  </label>
);

export const TopUpRadioCrypto = (props: Omit<TopUpRadioProps, 'children'>) => (
  <TopUpRadio {...props}>
    <div className="top-up-method-icons">
      <img className="top-up-method-icon" src={daiIcon} alt="Dai" />
      <img className="top-up-method-icon" src={EthereumIcon} alt="Ethereum" />
    </div>
    <p className="top-up-method-title">Crypto</p>
    <p className="top-up-method-text">Free-Deposit ETH or DAI</p>
  </TopUpRadio>
);

export const TopUpRadioFiat = (props: Omit<TopUpRadioProps, 'children'>) => (
  <TopUpRadio {...props}>
    <div className="top-up-method-icons">
      <img className="top-up-method-icon" src={cardIcon} alt="card" />
      <img className="top-up-method-icon" src={bankIcon} alt="Dai" />
    </div>
    <p className="top-up-method-title">Fiat</p>
    <p className="top-up-method-text">Buy using credit card or bank account</p>
  </TopUpRadio>
);

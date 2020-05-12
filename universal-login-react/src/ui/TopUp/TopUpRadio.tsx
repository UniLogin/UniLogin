import React, {ReactNode} from 'react';
import {Omit, isClassName} from '@unilogin/commons';
import cardIcon from './../assets/icons/card.svg';
import bankIcon from './../assets/icons/bank.svg';
import {classForComponent} from '../utils/classFor';
import {getIconForToken} from '../../core/utils/getIconForToken';

export interface TopUpRadioProps {
  onClick: () => void;
  checked: boolean;
  className?: string;
  children: ReactNode;
  name: string;
  id?: string;
  topUpCurrency?: string;
}

export const TopUpRadio = ({id, onClick, checked, children, className, name}: TopUpRadioProps) => (
  <label
    id={id}
    onClick={onClick}
    className={`${classForComponent('top-up-radio-label')} ${isClassName(className)}`}
  >
    <input
      className={classForComponent('top-up-radio')}
      type="radio"
      name={name}
      checked={checked}
      readOnly
    />
    <div className={classForComponent('top-up-radio-inner')}>
      {children}
    </div>
  </label>
);

export const TopUpRadioCrypto = (props: Omit<TopUpRadioProps, 'children'>) => (
  <TopUpRadio {...props}>
    <div className={classForComponent('top-up-method-icons')}>
      <img className={classForComponent('top-up-method-icon')} src={getIconForToken(props.topUpCurrency || 'ETH')} alt="Ethereum" />
    </div>
    <p className={classForComponent('top-up-method-title')}>Crypto</p>
    <p className={classForComponent('top-up-method-text')}>Free-Deposit {props.topUpCurrency}</p>
  </TopUpRadio>
);

export const TopUpRadioFiat = (props: Omit<TopUpRadioProps, 'children'>) => (
  <TopUpRadio {...props}>
    <div className={classForComponent('top-up-method-icons')}>
      <img className={classForComponent('top-up-method-icon')} src={cardIcon} alt="card" />
      <img className={classForComponent('top-up-method-icon')} src={bankIcon} alt="Dai" />
    </div>
    <p className={classForComponent('top-up-method-title')}>Card or Bank</p>
    <p className={classForComponent('top-up-method-text')}>Top-up with your bank account or credit/debit card</p>
  </TopUpRadio>
);

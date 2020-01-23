import React from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpRadioCrypto, TopUpRadioFiat} from './TopUpRadio';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalText} from '../commons/Modal/ModalText';
import {classForComponent} from '../utils/classFor';

interface ChooseTopUpMethodHeaderProps {
  topUpMethod?: TopUpMethod;
  setTopUpMethod: (arg: TopUpMethod) => void;
};

export const ChooseTopUpMethodHeader = ({topUpMethod, setTopUpMethod}: ChooseTopUpMethodHeaderProps) => (
  <div className={classForComponent('top-up-header')}>
    <ModalTitle>Choose a top-up method</ModalTitle>
    <ModalText>To create your account please choose a top-up method to fund your account.</ModalText>
    <div className={classForComponent('top-up-methods')}>
      <TopUpRadioCrypto
        id="topup-btn-crypto"
        onClick={() => setTopUpMethod('crypto')}
        checked={topUpMethod === 'crypto'}
        name="top-up-method"
        className={`${classForComponent('top-up-method')} ${topUpMethod === 'crypto' ? 'active' : ''}`}
      />
      <TopUpRadioFiat
        id="topup-btn-fiat"
        onClick={() => setTopUpMethod('fiat')}
        checked={topUpMethod === 'fiat'}
        name="top-up-method"
        className={`${classForComponent('top-up-method')} ${topUpMethod === 'fiat' ? 'active' : ''}`}
      />
    </div>
  </div>
);

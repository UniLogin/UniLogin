import React, {useState} from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpRadioCrypto, TopUpRadioFiat} from './TopUpRadio';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalText} from '../commons/Modal/ModalText';
import {classForComponent} from '../utils/classFor';

interface ChooseTopUpMethodHeaderProps {
  topUpMethod?: TopUpMethod;
  setTopUpMethod: (arg: TopUpMethod) => void;
};

export const ChooseTopUpMethodHeader = ({topUpMethod, setTopUpMethod}: ChooseTopUpMethodHeaderProps) => {
  const [isTextVisible, setIsTextVisible] = useState(true);

  const onMethodClick = (method: TopUpMethod) => {
    setTopUpMethod(method);
    setIsTextVisible(false);
  };

  return (
    <div className={classForComponent('top-up-header')}>
      <ModalTitle>Choose a top-up method</ModalTitle>
      {isTextVisible && <ModalText>To create your account please choose a top-up method to fund your account.</ModalText>}
      <div className={classForComponent('top-up-methods')}>
        <TopUpRadioFiat
          id="topup-btn-fiat"
          onClick={() => onMethodClick('fiat')}
          checked={topUpMethod === 'fiat'}
          name="top-up-method"
          className={`${classForComponent('top-up-method')} ${topUpMethod === 'fiat' ? 'active' : ''}`}
        />
        <TopUpRadioCrypto
          id="topup-btn-crypto"
          onClick={() => onMethodClick('crypto')}
          checked={topUpMethod === 'crypto'}
          name="top-up-method"
          className={`${classForComponent('top-up-method')} ${topUpMethod === 'crypto' ? 'active' : ''}`}
        />
      </div>
    </div>
  );
};

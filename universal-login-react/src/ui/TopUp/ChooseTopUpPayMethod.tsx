import React, {useState} from 'react';
import {ChooseTopUpMethodHeaderProps} from './ChooseTopUpMethodHeader';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpRadioCrypto, TopUpRadioFiat} from './TopUpRadio';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalText} from '../commons/Modal/ModalText';
import {classForComponent} from '../utils/classFor';

interface ChooseTopUpPayMethodProops extends ChooseTopUpMethodHeaderProps {
  titleText?: string;
  contentText?: string;
  iconCrypto?: string;
}

export const ChooseTopUpPayMethod = ({topUpMethod, setTopUpMethod, titleText, contentText, iconCrypto}: ChooseTopUpPayMethodProops) => {
  const [isTextVisible, setIsTextVisible] = useState(true);

  const onMethodClick = (method: TopUpMethod) => {
    setTopUpMethod(method);
    setIsTextVisible(false);
  };

  return (
    <div className={classForComponent('top-up-pay-method')}>
      <ModalTitle>Choose a top-up method</ModalTitle>
      {isTextVisible && <ModalText>To create your account please choose a top-up method to fund your account.</ModalText>}
      <div className={classForComponent('top-up-methods')}>
        <TopUpRadioCrypto
          id="topup-btn-crypto"
          onClick={() => onMethodClick('crypto')}
          checked={topUpMethod === 'crypto'}
          name="top-up-method"
          iconCrypto={iconCrypto}
          className={`${classForComponent('top-up-method')} ${topUpMethod === 'crypto' ? 'active' : ''}`}
        />
        <TopUpRadioFiat
          id="topup-btn-fiat"
          onClick={() => onMethodClick('fiat')}
          checked={topUpMethod === 'fiat'}
          name="top-up-method"
          className={`${classForComponent('top-up-method')} ${topUpMethod === 'fiat' ? 'active' : ''}`}
        />
      </div>
    </div>
  );
};
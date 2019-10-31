import React from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpRadioCrypto, TopUpRadioFiat} from './TopUpRadio';

interface ChooseTopUpMethodHeaderProps {
  topUpMethod?: TopUpMethod;
  setTopUpMethod: (arg: TopUpMethod) => void;
};

export const ChooseTopUpMethodHeader = ({topUpMethod, setTopUpMethod}: ChooseTopUpMethodHeaderProps) => (
  <div className="top-up-header">
    <h2 className="top-up-title">Choose a top-up method</h2>
    <div className="top-up-methods">
      <TopUpRadioCrypto
        id="topup-btn-crypto"
        onClick={() => setTopUpMethod('crypto')}
        checked={topUpMethod === 'crypto'}
        name="top-up-method"
        className={`top-up-method ${topUpMethod === 'crypto' ? 'active' : ''}`}
      />
      <TopUpRadioFiat
        id="topup-btn-fiat"
        onClick={() => setTopUpMethod('fiat')}
        checked={topUpMethod === 'fiat'}
        name="top-up-method"
        className={`top-up-method ${topUpMethod === 'fiat' ? 'active' : ''}`}
      />
    </div>
  </div>
);

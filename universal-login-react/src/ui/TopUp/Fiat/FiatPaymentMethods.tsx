import React from 'react';
import SafelloLogo from './../../assets/topUp/safello-white.png';
import RampLogo from './../../assets/topUp/ramp-white.png';
import WyreLogo from './../../assets/topUp/wyre-white.svg';
import {TopUpComponentType} from '../../../core/models/TopUpComponentType';
import {PaymentMethod} from './TopUpWithFiat';
import {TopUpRadio} from '../TopUpRadio';

interface FiatPaymentMethodsProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

export const FiatPaymentMethods = ({paymentMethod, setPaymentMethod}: FiatPaymentMethodsProps) => (
  <div className="fiat-payment-methods">
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.ramp}
      onClick={() => setPaymentMethod(TopUpComponentType.ramp)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={RampLogo} srcSet={RampLogo} alt="ramp" className="ramp-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.safello}
      onClick={() => setPaymentMethod(TopUpComponentType.safello)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={SafelloLogo} srcSet={SafelloLogo} alt="safello" className="safello-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.wyre}
      onClick={() => setPaymentMethod(TopUpComponentType.wyre)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={WyreLogo} srcSet={WyreLogo} alt="wyre" className="wyre-logo" />
    </TopUpRadio>
  </div>
);

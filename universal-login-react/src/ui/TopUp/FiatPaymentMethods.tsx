import React from 'react';
import SafelloLogo from './../assets/logos/safello.png';
import SafelloLogo2x from './../assets/logos/safello@2x.png';
import RampLogo from './../assets/logos/ramp.png';
import RampLogo2x from './../assets/logos/ramp@2x.png';
import WyreLogo from './../assets/logos/wyre.png';
import WyreLogo2x from './../assets/logos/wyre@2x.png';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {PaymentMethod} from './TopUpWithFiat';
import {TopUpRadio} from './TopUpRadio';

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
      <img src={RampLogo} srcSet={RampLogo2x} alt="ramp" className="ramp-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.safello}
      onClick={() => setPaymentMethod(TopUpComponentType.safello)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={SafelloLogo} srcSet={SafelloLogo2x} alt="safello" className="safello-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.wyre}
      onClick={() => setPaymentMethod(TopUpComponentType.wyre)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={WyreLogo} srcSet={WyreLogo2x} alt="wyre" className="wyre-logo" />
    </TopUpRadio>
  </div>
);

import React from 'react';
import SafelloLogoWhite from './../../assets/topUp/safello-white.png';
import Safello from './../../assets/logos/safello@2x.png';
import RampLogoWhite from './../../assets/topUp/ramp-white.png';
import RampLogo from './../../assets/logos/ramp.png';
import WyreLogoWhite from './../../assets/topUp/wyre-white.svg';
import WyreLogo from './../../assets/logos/wyre@2x.png';
import {TopUpComponentType} from '../../../core/models/TopUpComponentType';
import {PaymentMethod} from './TopUpWithFiat';
import {TopUpRadio} from '../TopUpRadio';

interface FiatPaymentMethodsProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  logoColor?: LogoColor;
}

export type LogoColor = 'white' | 'black';

const getRampLogo = (logoColor: LogoColor) => logoColor === 'white' ? RampLogoWhite : RampLogo;
const getSafelloLogo = (logoColor: LogoColor) => logoColor === 'white' ? SafelloLogoWhite : Safello;
const getWyreLogo = (logoColor: LogoColor) => logoColor === 'white' ? WyreLogoWhite : WyreLogo;

export const FiatPaymentMethods = ({paymentMethod, setPaymentMethod, logoColor = 'white'}: FiatPaymentMethodsProps) => (
  <div className="fiat-payment-methods">
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.ramp}
      onClick={() => setPaymentMethod(TopUpComponentType.ramp)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={getRampLogo(logoColor)} srcSet={getRampLogo(logoColor)} alt="ramp" className="ramp-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.safello}
      onClick={() => setPaymentMethod(TopUpComponentType.safello)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={getSafelloLogo(logoColor)} srcSet={getSafelloLogo(logoColor)} alt="safello" className="safello-logo" />
    </TopUpRadio>
    <TopUpRadio
      checked={paymentMethod === TopUpComponentType.wyre}
      onClick={() => setPaymentMethod(TopUpComponentType.wyre)}
      name="payment-method"
      className="fiat-payment-method"
    >
      <img src={getWyreLogo(logoColor)} srcSet={getWyreLogo(logoColor)} alt="wyre" className="wyre-logo" />
    </TopUpRadio>
  </div>
);

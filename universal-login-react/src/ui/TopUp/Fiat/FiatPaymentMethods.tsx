import React from 'react';
import SafelloLogoWhite from './../../assets/topUp/safello-white.png';
import Safello from './../../assets/logos/safello@2x.png';
import RampLogoWhite from './../../assets/topUp/ramp-white.png';
import RampLogo from './../../assets/logos/ramp.png';
import WyreLogoWhite from './../../assets/topUp/wyre-white.svg';
import WyreLogo from './../../assets/logos/wyre@2x.png';
import {TopUpRadio} from '../TopUpRadio';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';

interface FiatPaymentMethodsProps {
  selectedCountry: string;
  supportService: TopUpProviderSupportService;
  paymentMethod?: TopUpProvider;
  setPaymentMethod: (paymentMethod: TopUpProvider) => void;
  logoColor?: LogoColor;
}

export type LogoColor = 'white' | 'black';

export const FiatPaymentMethods = ({selectedCountry, supportService, paymentMethod, setPaymentMethod, logoColor = 'white'}: FiatPaymentMethodsProps) => {
  const rampLogo = logoColor === 'white' ? RampLogoWhite : RampLogo;
  const safelloLogo = logoColor === 'white' ? SafelloLogoWhite : Safello;
  const wyreLogo = logoColor === 'white' ? WyreLogoWhite : WyreLogo;

  return (
    <div className="fiat-payment-methods">

      {supportService.checkRampSupport(selectedCountry) &&
      <TopUpRadio
          checked={paymentMethod === TopUpProvider.RAMP}
          onClick={() => setPaymentMethod(TopUpProvider.RAMP)}
          name="payment-method"
          className="fiat-payment-method"
      >
          <img src={rampLogo} srcSet={rampLogo} alt="ramp" className="ramp-logo"/>
      </TopUpRadio>}

      {supportService.checkSafelloSupport(selectedCountry) &&
      <TopUpRadio
          checked={paymentMethod === TopUpProvider.SAFELLO}
          onClick={() => setPaymentMethod(TopUpProvider.SAFELLO)}
          name="payment-method"
          className="fiat-payment-method"
      >
          <img src={safelloLogo} srcSet={safelloLogo} alt="safello" className="safello-logo"/>
      </TopUpRadio>}

      {supportService.checkWyreSupport(selectedCountry) &&
      <TopUpRadio
          checked={paymentMethod === TopUpProvider.WYRE}
          onClick={() => setPaymentMethod(TopUpProvider.WYRE)}
          name="payment-method"
          className="fiat-payment-method"
      >
          <img src={wyreLogo} srcSet={wyreLogo} alt="wyre" className="wyre-logo"/>
      </TopUpRadio>}
    </div>
  );
};
